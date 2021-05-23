import cryptoRandomString from 'crypto-random-string';

export class Controller {

    constructor(model) {
        this.model = model
    }
    allowedSignIn(req,res,next) {
        if(req.session.userId) {
            next()
        }
        else {
            res.redirect('/login')
        }
    }
    allowedNotSignIn(req,res,next) {
        if(req.session.userId) {
            res.redirect('/profile')
        } else {
            next()
        }
    }
    async login(email,password,context) {
        try {
            let result = await this.model.getUserByEmail(email)
            if(result.password === password) {

                this.signIn(result.id,result,context.session)
                context.response.redirect('/')
                console.log('successful login ' + result.id)
            } else {
                context.response.redirect('/login')
            }
        } catch (error) {
            context.response.redirect('/login')
        }
    }
    signIn(id,data,session) {
        session.userId = id;
        session.userName = data.login
        session.email = data.email
        session.gender = data.sex
        session.number = data.phone_number
    }

    async register(registration_data,context) {
        try {
            let id = await this.model.addUser(registration_data)
            console.log(id)
            this.signIn(id,registration_data,context.session)
            context.response.redirect('/')
            console.log('successful registration')
        } catch (error) {
            context.response.redirect('/register')
        }
    }
    async generateShortLink(link,context) {
        console.log(context.session.userId)
        console.log(link)
        try {
            let short = cryptoRandomString({length: 10, type: 'url-safe'});
            let id = await this.model.addLink(link,short,context.session.userId)
            context.response.send({id : id,short_link : short})
        } catch (error) {
            console.log('error')
            context.response.status(500)
        }
    }
    async redirectToOriginal(shortLink,context) {
        try {
            let data = await this.model.findOriginalLink(shortLink,context.session.userId)
            console.log(data)
            if(data) {
                context.response.redirect(data.original_link)
            } else {
                context.response.status(404).send('page not found')
            }
        } catch (error) {
            console.log('bd error')
            context.response.status(404).send('page not found')
        }
    }
    async getAllLinks(context){
        if(context.session.userId === undefined) {
            context.response.status(403)
            return
        }

        try {
            let data = await this.model.getUserLinks(context.session.userId)
            context.response.send(data)
        } catch (error) {

            console.log('error getAllLinks')
            console.log(error)
            context.response.status(500)
        }
    }
    async deleteLink(linkId,context) {
        if(context.session.userId === undefined){
            context.response.status(403)
            return
        }
        try {
            await this.model.removeLink(context.session.userId,linkId)
            context.response.status(200)
        } catch (error) {
            context.response.status(500)
        }
    }
    async updateLink(linkId,newLink,context) {

        if(context.session.userId === undefined){
            context.response.status(403)
            return
        }
        try {
            await this.model.updateLink(context.session.userId,linkId,newLink)
            context.response.status(200)
        } catch (error) {
            context.response.status(500)
        }

    }
}