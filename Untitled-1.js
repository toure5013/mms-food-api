



const MSISDN = {{ phone_number }};

const request = require('request');
const _ = require("lodash");

// Function to validate MSISDN by removing spaces and other non-digit characters
function isValidMSISDN(MSISDN) {
    const cleanedMSISDN = MSISDN.replace(/\D/g, ''); // Remove all non-digit characters
    const regex = /^(00225|\+225|225)?(07|27)\d{8}$/; // Validate number format
    return regex.test(cleanedMSISDN); // Return true or false
}


function getPukCode(token) {

    // Clean MSISDN before sending it
    const cleanedMSISDN = MSISDN.replace(/\D/g, ''); // Clean MSISDN (remove spaces)

    // First, validate MSISDN
    if (!isValidMSISDN(MSISDN)) {
        messenger_answer.push({ text: "Désolé, le numéro n'est pas un numéro Orange valide." });
        callback(output);
        return;
    }


    const body = {
        "key": cleanedMSISDN,
        "resource": "MSISDN"
    }


    const options = {
        method: 'POST',
        url: "https://inside01.api.orange.com/oci/neptunev2/assistance-bot-experience/v1/puk-codes",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };

    request(options, function (error, response) {
        if (error || !response.body) {
            output.answer = "Désolé, nous n'avons pas pu obtenir votre code PUK. Veuillez récupérer votre code en composant le #124*66# depuis un autre téléphone.";
        } else {
            const puk = JSON.parse(response.body).value

            const formattedPuk = puk //.split('').map((char) => `${char}..... <break time="2000ms"/>`).join('');

            if (!puk) {
                output.answer = "Désolé, nous n'avons pas pu obtenir votre code PUK. Veuillez récupérer votre code en composant le #124*66# depuis un autre téléphone.";
                callback(output);
                return
            }

            output.answer = "Le code PUK du " + MSISDN + " est : " + formattedPuk;
            output.answer = "Encore une fois le code PUK du " + MSISDN + " est : " + formattedPuk;
        }
        callback(output)
    });
}



function makeODIRequest() {
    const options = {
        method: "POST",
        url: "https://api-assistance-bot.orange.ci:8280/token",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials",
    };

    request.post(options, (error, response, body) => {
        if (error) {
            console.log("Désolé, une erreur est survenue: ", error);
            // stop the bot execution here
            getPukCode("")
            return;
        }

        // if request get executed successfully, pass the generated token to callback function for next instructions
        if (response && response.statusCode === 200 && body) {
            getPukCode(JSON.parse(body).access_token);
        }
    });
}



makeODIRequest()


