package com.example.contactlist

import java.lang.RuntimeException
import java.time.Instant
import java.util.concurrent.CopyOnWriteArrayList
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.http.HttpStatus.CREATED
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class ContactListApplication

fun main(args: Array<String>) {
    runApplication<ContactListApplication>(*args)
}

data class Contact(
    val name: String = "",
    val phoneNumbers: Map<String, String> = mapOf(),
    val createdAt: Instant = Instant.now(),
)

@Service
class ContactsRepository {

    private val database: CopyOnWriteArrayList<Contact> = CopyOnWriteArrayList()

    fun getAllContacts(): List<Contact> = database

    fun save(newContact: Contact): Contact {
        database.add(newContact)
        return newContact
    }
}

@RestController
class ContactListResource(val contactsRepository: ContactsRepository) {

    @GetMapping("/api/v1/contacts")
    fun getAllContacts(): List<Contact> =
        contactsRepository.getAllContacts()

    @ResponseStatus(CREATED)
    @PostMapping("/api/v1/contacts")
    fun createContact(@RequestBody newContact: Contact): Contact {
        val phoneNumberExists = newContact.phoneNumbers.values
            .any { phoneNumber -> contactsRepository.getAllContacts().any { it.phoneNumbers.containsValue(phoneNumber) } }
        if (phoneNumberExists) throw RuntimeException("Look like contact ${newContact.name} phone number already exists")
        return contactsRepository.save(newContact)
    }
}
