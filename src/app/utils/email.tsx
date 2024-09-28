import emailjs from '@emailjs/browser';

function sendEmail(emailObj:any, callback:Function) {
    let service_id = process.env.NEXT_PUBLIC_SERVICE_ID
    let template_id = process.env.NEXT_PUBLIC_TEMPLATE_ID
    let public_key = process.env.NEXT_PUBLIC_PUBLIC_KEY
    if(!service_id) service_id="";
    if(!template_id) template_id="";
    if(!public_key) public_key="";
    emailjs.send(service_id, template_id, emailObj, public_key)
    .then(function(response) {
        callback('Email Send Success', "y", emailObj);
    }, function(err) {

        callback('Email Send Failed', "n");
    });
  }
export  {sendEmail}