const axios = require("axios")
const {exec} = require('child_process');
const fs = require("fs")
const express = require("express")
const cors = require("cors")

const app = express()
const prompt = require('prompt-sync')();

let token

const spotifyLink = "https://accounts.spotify.com/en/authorize?client_id=0d94fdd25d3c403ebaeb67d04858152a&redirect_uri=http://localhost:6748/success&response_type=token&scope=user-modify-playback-state"


const host = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf8'})).host;

console.log(host)

let data = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf8'}));

let server

axios({
    method: 'post',
    url: "http://" + host + ":2500/connectClient",
    headers: {},
    data: {
        "client": "receiver"
    }
}).then((response) => {
    token = response.data.token

    console.warn("Please do not show your token to others.")
    setTimeout(() => {
        console.log("Token:", token)
    }, 2000)



    setInterval(() => {
        axios({
            method: "get",
            url: "http://" + host + ":2500/checkQueue",
            headers: {
                "token": token
            }
        }).then((response) => {

            data = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf8'}));

            if (response.data.status === 401) {

            } else {
                // console.log(response.data)
                // console.log(response.data.length)

                for (let i = 0; i < response.data.length; i++) {

                    if (response.data[i].job === "startApp") {

                        startApp(response.data[i].comment)
                    }

                    if(response.data[i].job === "spotifyControls") {
                        spotifyControls(response.data[i].comment)
                    }
                }

                function startApp(appName) {


                    let found = false


                    for (let i = 0; i < data.paths.length; i++) {

                        if (appName === data.paths[i].name) {

                            found = true

                            exec("cd " + data.paths[i].path + " && start " + data.paths[i].exe)

                            exec(data.paths[i].exe).unref()

                            console.log("Starting", data.paths[i].exe)

                        }
                    }

                    if (!found) {

                        let addApp = {
                            "name": appName,
                            "path": "",
                            "exe": ""
                        }

                        const path = prompt('Path > ');
                        const exe = prompt('exe name > ');

                        addApp.path = path
                        addApp.exe = exe

                        data.paths.push(addApp)

                        fs.writeFileSync("./config.json", JSON.stringify(data))
                    }


                }

                function spotifyControls (control) {
                    if(data.spotifyToken === null) {
                        console.log("To log into your Spotify account, follow this Link: " + spotifyLink)
                        server = app.listen(6748)
                    } else {
                        if(control === "pause") {
                            sendSpotify(control)
                        } else if(control === "continue") {
                            sendSpotify(control)
                        } else if(control === "skip") {
                            sendSpotify(control)
                        } else if(control === "back") {
                            sendSpotify(control)
                        } else if(control === "louder") {
                            sendSpotify(control)
                        } else if(control === "quieter") {
                            sendSpotify(control)
                        } else {
                            console.log("Please check the contols.")
                        }
                    }
                }
            }

        }).catch((error) => {
            console.log(error)
        })
    }, 1000)


});

function sendSpotify(action) {
    const token = data.spotifyToken

    console.log("Spotify " + action)

    if(action === "continue") {
        axios({
            method: 'put',
            url: "https://api.spotify.com/v1/me/player/play",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: {}
        }).then((response) => {

        }).catch((error) => {

        })
    }

    if(action === "pause") {
        axios({
            method: 'put',
            url: "https://api.spotify.com/v1/me/player/pause",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: {}
        }).then((response) => {

        }).catch((error) => {

        })
    }

    if(action === "skip") {
        axios({
            method: 'post',
            url: "https://api.spotify.com/v1/me/player/next",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: {}
        }).then((response) => {

        }).catch((error) => {

        })
    }

    if(action === "back") {
        axios({
            method: 'post',
            url: "https://api.spotify.com/v1/me/player/previous",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: {}
        }).then((response) => {

        }).catch((error) => {

        })
    }
}

app.use(cors())


app.get("/success", (req, res) => {


    res.send(fs.readFileSync('./pages/success.html', {encoding: 'utf8'}))
})

app.get("/setToken", (req, res) => {

    data.spotifyToken = req.headers.token

    fs.writeFileSync("./config.json", JSON.stringify(data))

    data = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf8'}));

    server.close()
})