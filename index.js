const axios = require("axios")
const {exec} = require('child_process');
const fs = require("fs")
const prompt = require('prompt-sync')();

let token


const host = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf8'})).host;

console.log(host)

let data = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf8'}));

axios({
    method: 'post',
    url: "http://" + host + ":2500/connectClient",
    headers: {},
    data: {
        "client": "receiver"
    }
}).then((response) => {
    token = response.data.token

    console.log("Token:", token)

    setInterval(() => {
        axios({
            method: "get",
            url: "http://" + host + ":2500/checkQueue",
            headers: {
                "token": token
            }
        }).then((response) => {

            if (response.data.status === 401) {

            } else {
                // console.log(response.data)
                // console.log(response.data.length)

                for (let i = 0; i < response.data.length; i++) {

                    if (response.data[i].job === "startApp") {

                        startApp(response.data[i].comment)
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
            }

        }).catch((error) => {
            console.log(error)
        })
    }, 1000)


});
