const pool = require('../database')
const express = require('express')
const router = express.Router()

router.post('/login', async (req, res) => {
    const { firstName, lastName, password } = req.body
    if (firstName == "" || lastName == "" || password == "") {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    const query = {
        text: 'SELECT * FROM customer WHERE first_name = $1 AND last_name = $2 AND password = $3',
        values: [firstName, lastName, password]
    }
    await pool.query(query, (error, results) => {
        if (error || results.rowCount == 0) {
            console.error('Could not find user in database.')
            res.status(400).json({ message: "Invalid credentials" })
        } else {
            res.status(200).json(results.rows[0])
        }
    })
})

router.post('/create', async (req, res) => {
    const { firstName, lastName, password, roleId, city, companyName } = req.body

    const existing_user_query = {
        text: 'SELECT * FROM customer WHERE first_name = $1 AND last_name = $2',
        values: [firstName, lastName]
    }
    const users_existing = await pool.query(existing_user_query)
    if (users_existing.rowCount > 0) {
        console.log("User already exists")
        return res.status(400).json({ message: "This name already exists." }).send()
    }

    const query = {
        text: 'INSERT INTO customer(first_name, last_name, password, registration_date, role_id) VALUES($1, $2, $3, current_timestamp, $4) RETURNING *',
        values: [firstName, lastName, password, roleId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            console.log(results.rows)
            if (roleId == 4) {
                const createCompanyQuery = {
                    text: "INSERT INTO publisher(city, company_name, customer_id) VALUES($1, $2, $3);",
                    values: [city, companyName, results.rows[0].id]
                }
                pool.query(createCompanyQuery)
            }
            res.status(201).json({ message: "User created successfully." })
        }
    });
})

router.patch('/update', async (req, res) => {

})

module.exports = router