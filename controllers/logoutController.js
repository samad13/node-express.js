const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises
const path = require('path');


const handleLogout = async (req, res) => {
    //also delete on the client
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);// no content
    const refreshToken = cookies.jwt;

    //is refrsh roken in db
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 1000 });
        return res.sendStatus(204);
    }
    //Delete refresh token
    const otherUsers = usersDB.users.filter(person => person.refreshToken === refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDB.users)
    );
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true, });
    res.sendStatus(204);
}

module.exports = { handleLogout }