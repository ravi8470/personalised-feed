const pool = require('../Pool');
import axios from "axios";

var newRows = new Array;
exports.populateArticles = async function(){
    var topics = await pool.query('SELECT * from topics');
    var cnt = 0;
    topics.rows.forEach(async (element, index) => {
        let res = await axios.get(`https://www.reddit.com/r/${element.name}/hot.json?limit=6`);
        await res.data.data.children.forEach((obj) => {
            let {id, permalink: url, title } = obj.data;
            var temp= {
                id: id,
                url: 'https://www.reddit.com'+url,
                title: title,
                topic_id: element.id
            }
            newRows.push(temp);
        });
        console.log('inside loop');
        if(++cnt == 10){
            updateArticlesInDB();
        }
    });
    console.log('outside inside loop')
}

async function updateArticlesInDB(){
    console.log('in updateArticlesInDB');
    // console.log(newRows);
    var articleIDs = await pool.query('SELECT id from articles');
    articleIDs = articleIDs.rows.map(item => item.id);
    console.log(articleIDs);
    var toBeInsertedRows = newRows.filter(newRow => articleIDs.indexOf(newRow.id) == -1);
    for(var row of toBeInsertedRows){
        await pool.query('insert into articles values($1,$2,$3,$4)',[row.id,row.url,row.title,row.topic_id]);
    }
    var toBeInsertedIDs =  toBeInsertedRows.map(de => de.id);
    console.log('tobeinsertedid' + toBeInsertedIDs);
    var newRowIDs = newRows.map(c => c.id);
    var toBeDeletedRowIDs = articleIDs.filter(g => newRowIDs.indexOf(g) == -1);
    await pool.query('delete from articles where id = ANY($1)',[toBeDeletedRowIDs]);
    console.log('tobe deleted ids;' + toBeDeletedRowIDs);

}