import file from 'fs'
import path from 'path'

function Username(name, callback) {
    file.readFile(path.resolve(`routes/usernames.txt`), 'utf-8', (err, data) => {
        if (err) {
            console.log("ERROR:", err);
            return callback(err, false);
        } else {
            const unames = data.split('\n').map(u => u.trim());
            const e = unames.includes(name);
            callback(null, e)
        }
    });
}

// Username("VoyagerX21", (err, data) => {
//     if (err){
//         console.log("ERROR: ",err);
//     }
//     else{
//         if (data){
//             console.log("PRESENT");
//         }
//         else{
//             console.log("NOT PRESENT");
//         }
//     }
// });

function Email(name, callback) {
    file.readFile(path.resolve(`routes/Emails.txt`), 'utf-8', (err, data) => {
        if (err) {
            console.log("ERROR:", err);
            return callback(err, false);
        } else {
            const unames = data.split('\n').map(u => u.trim());
            const e = unames.includes(name);
            callback(null, e)
        }
    });
}

export {Username, Email};