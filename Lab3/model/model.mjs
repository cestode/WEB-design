
export class Model {
    constructor(dbConnection) {
        this.db = dbConnection;
    }
    addUser(data) {
        var self = this;
        return new Promise((resolve,reject) => {
            self.db.run('INSERT INTO users (email,login,phone_number,password,sex) VALUES (?,?,?,?,?)',[data.email,data.login,data.phoneNumber,data.pass,data.sex],function (error) {
                if(error) {
                    reject(error)
                } else {
                    resolve(this.lastID)
                }
                
            })
        })
    }
    getUserByEmail(email) {
        var self = this;
        return new Promise((resolve,reject) => {
            self.db.get('SELECT * FROM users WHERE email = ?',[email],(error,row)=>{

                if(error) {
                    reject(error)
                } else {
                    console.log(row)
                    resolve(row)
                }
            })
        })
    }
    addLink(link,shortLink,userId) {
        var self = this;
        return new Promise((resolve,reject) => {
            self.db.run('INSERT INTO links (original_link,short_link,user_id) VALUES (?,?,?)',[link,shortLink,userId],function (error) {
                if(error) {
                    reject(error)
                } else {
                    resolve(this.lastID)
                }
                
            })
        })
    }
    getUserLinks(userId) {
        var self = this;
        return new Promise((resolve,reject) => {
            self.db.all('SELECT id,original_link,short_link FROM links WHERE user_id = ?',[userId],(error,rows)=>{
                if(error) {
                    reject(error)
                } else {
                    resolve(rows)
                }
            })
        })
    }
    findOriginalLink(shortLink,userId) {
        var self = this;
        return new Promise((resolve,reject) => {
            
            let callback = (error,row)=>{
                if(error) {
                    reject(error)
                } else {
                    resolve(row)
                }
            }

            if(userId) {
                self.db.get('SELECT original_link FROM links WHERE user_id = ? AND short_link = ?',[userId,shortLink],callback)
            } else {
                self.db.get('SELECT original_link FROM links WHERE user_id IS NULL AND short_link = ?',[shortLink],callback)
            }

        })
    }
    updateLink(userId,linkId,newLink) {
        var self = this;
        return new Promise((resolve,reject) => {
            self.db.run('UPDATE links SET original_link = ? WHERE user_id = ? AND id = ?',[newLink,userId,linkId],(err) =>{
                if(err){
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }
    removeLink(userId,linkId) {
        var self = this;
        return new Promise((resolve,reject)=>{
            self.db.run('DELETE FROM links WHERE user_id = ? AND id = ?',[userId,linkId],(err)=>{
                if(err){
                    reject(err)
                } else {
                    resolve()
                }
            })

        })
    }

}