document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactList = document.getElementById('contactList');

    // Load contacts from local storage when the page loads
    loadContacts();

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;

        addContact(name, phone, email);
        contactForm.reset();
    });

    function addContact(name, phone, email) {
        // Check if any field is empty
        if (!name || !phone || !email) {
            displayAlert("Please fill in all fields.");
            return;
        }

        const contact = { name, phone, email };
        const contactItem = document.createElement('div');
        contactItem.classList.add('contact-item');
        contactItem.dataset.name = name; // Set data attributes for contact info
        contactItem.dataset.phone = phone;
        contactItem.dataset.email = email;
        contactItem.innerHTML = `
            <strong>Name:</strong> ${name}<br>
            <strong>Phone:</strong> ${phone}<br>
            <strong>Email:</strong> ${email}
            <button class="delete-btn">Delete</button>
            <button class="edit-btn">Edit</button>
        `;
        contactList.appendChild(contactItem);

        // Save contact to local storage
        saveContacts();
    }

    // Event delegation for delete and edit buttons
    contactList.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            deleteContact(event.target.parentElement);
        } else if (event.target.classList.contains('edit-btn')) {
            editContact(event.target.parentElement);
        }
    });

    function deleteContact(contactItem) {
        const name = contactItem.dataset.name;
        const phone = contactItem.dataset.phone;
        const email = contactItem.dataset.email;

        contactItem.remove();

        // Remove contact from local storage
        removeContactFromLocalStorage(name, phone, email);
    }

    function editContact(contactItem) {
        const name = contactItem.dataset.name;
        const phone = contactItem.dataset.phone;
        const email = contactItem.dataset.email;

        // Populate the form fields with existing contact information
        document.getElementById('name').value = name;
        document.getElementById('phone').value = phone;
        document.getElementById('email').value = email;

        // Delete the existing contact
        contactItem.remove();
    }

    function loadContacts() {
        const contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.forEach(contact => {
            addContact(contact.name, contact.phone, contact.email);
        });
    }

    function saveContacts() {
        const contactItems = contactList.getElementsByClassName('contact-item');
        const contacts = [];
        for (let i = 0; i < contactItems.length; i++) {
            const contact = contactItems[i];
            const name = contact.dataset.name;
            const phone = contact.dataset.phone;
            const email = contact.dataset.email;
            contacts.push({ name, phone, email });
        }
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    function removeContactFromLocalStorage(name, phone, email) {
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts = contacts.filter(contact => {
            return contact.name !== name || contact.phone !== phone || contact.email !== email;
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

    function displayAlert(message) {
        const alertContainer = document.createElement('div');
        alertContainer.classList.add('alert');
        alertContainer.textContent = message;
        document.body.appendChild(alertContainer);
        setTimeout(() => {
            alertContainer.remove();
        }, 3000); // Remove alert after 3 seconds
    }
});
