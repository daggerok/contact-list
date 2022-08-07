// this will be executed as soon HTML page will be fully loaded in the browser
document.addEventListener('DOMContentLoaded', main, false);

function onRejectedErrorHandler(err) {
  console.log('error:', err);
  onError(err);
}

function main() {
  fetch('http://localhost:8080/api/v1/contacts')
    .then(response => response.json())
    .then(json => json.forEach(onContact))
    .catch(onRejectedErrorHandler)
  ;

  const plusElement = document.querySelector('#add');
  plusElement.addEventListener('click', onPlusElementClick);
}

function onPlusElementClick() {
  const queryElement = document.querySelector('#query');
  const userWithPhoneNumberRegex = /\s(\+)?[0-9\-\s\(\)]+$/; // means that we have Name space optional plus and phone number pattern
  const userNameWithPhoneNumber = queryElement.value;
  const isValidNameWithPhoneNumber = userWithPhoneNumberRegex.test(userNameWithPhoneNumber);
  if (!isValidNameWithPhoneNumber) return;
  const parts = userNameWithPhoneNumber.split(userWithPhoneNumberRegex)
  if (!parts.length) return;
  const name = parts[0];
  const phoneNumber = userNameWithPhoneNumber.substring(name.length).trim();
  const createContactURL = 'http://localhost:8080/api/v1/contacts';
  const requestBody = JSON.stringify({
    name: name,
    phoneNumbers: {
      Main: phoneNumber,
    },
  });
  const createContactRequest = {
    body: requestBody,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    cors: true,
    cache: 'no-cache',
    referrerPolicy: 'no-referrer',
  };
  fetch(createContactURL, createContactRequest)
    .then(response => response.json())
    .then(onContact)
    .then(ignored => {
      queryElement.value = '';
    })
    .catch(onRejectedErrorHandler)
  ;
}

function onContact(contact) {
  if (!contact || !contact.name || !contact.phoneNumbers) return;
  const name = contact.name;
  const phoneNumber = contact.phoneNumbers['Main'];
  const liElement = document.createElement('li');
  liElement.textContent = `Name: ${name}, phone: ${phoneNumber}`
  const ulElement = document.querySelector('#contacts');
  ulElement.prepend(liElement);
}

function onError(error) {
  const liElement = document.createElement('li');
  liElement.className = "error"
  liElement.textContent = `${error.message || error}`
  const ulElement = document.querySelector('#contacts');
  ulElement.prepend(liElement);
}
