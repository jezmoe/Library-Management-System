const pool = require('../database')
const express = require('express')
const router = express.Router()

// All devices
router.get('/media', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM media WHERE media.id NOT IN (select media_id from media_to_customer where returned_at is NULL) AND media.id NOT IN (select media_id from hold_to_media WHERE held_until > current_timestamp)');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/books', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM book WHERE book.id NOT IN (select book_id from book_to_customer where returned_at is NULL) AND book.id NOT IN (select book_id from hold_to_book WHERE held_until > current_timestamp)')
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/devices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM device WHERE device.id NOT IN (select device_id from device_to_customer where returned_at is NULL) AND device.id NOT IN (select device_id FROM hold_to_device WHERE held_until > current_timestamp)');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Loan
router.post('/loanBook', async (req, res) => {
    const { userId, bookId } = req.body
    const query = {
        text: 'INSERT INTO book_to_customer(customer_id, book_id, loaned_at, loaned_until, returned_at) VALUES($1, $2, current_timestamp, current_timestamp + interval \'30 seconds\', NULL)',
        values: [userId, bookId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book loaned successfully." })
        }
    });

    const checkIfHeldQuery = {
        text: 'DELETE FROM hold_to_book WHERE customer_id = $1 AND book_id = $2',
        values: [userId, bookId]
    }
    await pool.query(checkIfHeldQuery)
})

router.post('/loanMedia', async (req, res) => {
    const { userId, mediaId } = req.body
    const query = {
        text: 'INSERT INTO media_to_customer(customer_id, media_id, loaned_at, loaned_until, returned_at) VALUES($1, $2, current_timestamp, current_timestamp + interval \'30 seconds\', NULL)',
        values: [userId, mediaId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Media loaned successfully." })
        }
    });

    const checkIfHeldQuery = {
        text: 'DELETE FROM hold_to_media WHERE customer_id = $1 AND media_id = $2',
        values: [userId, mediaId]
    }
    await pool.query(checkIfHeldQuery)
})

router.post('/loanDevice', async (req, res) => {
    const { userId, deviceId } = req.body
    const query = {
        text: 'INSERT INTO device_to_customer(customer_id, device_id, loaned_at, loaned_until, returned_at) VALUES($1, $2, current_timestamp, current_timestamp + interval \'30 seconds\', NULL)',
        values: [userId, deviceId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Device loaned successfully." })
        }
    });

    const checkIfHeldQuery = {
        text: 'DELETE FROM hold_to_device WHERE customer_id = $1 AND device_id = $2',
        values: [userId, deviceId]
    }
    await pool.query(checkIfHeldQuery)
})

// Hold
router.post('/holdBook', async (req, res) => {
    const { userId, bookId } = req.body
    const query = {
        text: 'INSERT INTO hold_to_book(customer_id, book_id, held_at, held_until) VALUES($1, $2, current_timestamp, current_timestamp + interval \'30 seconds\')',
        values: [userId, bookId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book held successfully." })
        }
    });
})

router.post('/holdMedia', async (req, res) => {
    const { userId, mediaId } = req.body
    const query = {
        text: 'INSERT INTO hold_to_media(customer_id, media_id, held_at, held_until) VALUES($1, $2, current_timestamp, current_timestamp + interval \'30 seconds\')',
        values: [userId, mediaId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Media held successfully." })
        }
    });
})

router.post('/holdDevice', async (req, res) => {
    const { userId, deviceId } = req.body
    const query = {
        text: 'INSERT INTO hold_to_device(customer_id, device_id, held_at, held_until) VALUES($1, $2, current_timestamp, current_timestamp + interval \'30 seconds\')',
        values: [userId, deviceId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Device held successfully." })
        }
    });
})

// Return
router.post('/returnBook', async (req, res) => {
    const { userId, bookId } = req.body
    const query = {
        text: 'UPDATE book_to_customer SET returned_at = current_timestamp WHERE customer_id=$1 AND book_id=$2 AND returned_at IS NULL ',
        values: [userId, bookId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book returned successfully." })
        }
    });
})

router.post('/returnMedia', async (req, res) => {
    const { userId, mediaId } = req.body
    const query = {
        text: 'UPDATE media_to_customer SET returned_at = current_timestamp WHERE customer_id=$1 AND media_id=$2 AND returned_at IS NULL',
        values: [userId, mediaId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Media returned successfully." })
        }
    });
})

router.post('/returnDevice', async (req, res) => {
    const { userId, deviceId } = req.body
    const query = {
        text: 'UPDATE device_to_customer SET returned_at = current_timestamp WHERE customer_id=$1 AND device_id=$2 AND returned_at IS NULL',
        values: [userId, deviceId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Device returned successfully." })
        }
    });
})

// Extend
router.post('/extendBook', async (req, res) => {
    const { userId, bookId } = req.body
    const query = {
        text: 'UPDATE book_to_customer SET loaned_until = loaned_until + interval \'30 seconds\' WHERE customer_id=$1 AND book_id=$2 ',
        values: [userId, bookId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book extended successfully." })
        }
    });
})

router.post('/extendMedia', async (req, res) => {
    const { userId, mediaId } = req.body
    const query = {
        text: 'UPDATE media_to_customer SET loaned_until = loaned_until + interval \'30 seconds\' WHERE customer_id=$1 AND media_id=$2 ',
        values: [userId, mediaId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Media extended successfully." })
        }
    });
})

router.post('/extendDevice', async (req, res) => {
    const { userId, deviceId } = req.body
    const query = {
        text: 'UPDATE device_to_customer SET loaned_until = loaned_until + interval \'30 seconds\' WHERE customer_id=$1 AND device_id=$2 ',
        values: [userId, deviceId],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Device extended successfully." })
        }
    });
})

router.post('/updateBook', async (req, res) => {
    const {
        id,
        title,
        isbn,
        condition,
        edition,
        year
    } = req.body
    const query = {
        text: 'UPDATE book SET title = $2, isbn = $3, condition = $4, edition = $5, release_year = $6  WHERE id = $1 ',
        values: [id, title, isbn, condition, edition, year],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book updated successfully." })
        }
    });
})

router.post('/updateMedia', async (req, res) => {
    const {
        id,
        title,
        author,
        type,
        size
    } = req.body
    const query = {
        text: 'UPDATE media SET title = $2, author = $3, file_type = $4, file_size = $5 WHERE id = $1 ',
        values: [id, title, author, type, size],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book updated successfully." })
        }
    });
})

router.post('/updateDevice', async (req, res) => {
    const {
        id,
        device_name,
        device_type,
        maintenance_history,
        operating_system,
        serial_number,
    } = req.body
    const query = {
        text: 'UPDATE device SET device_name = $2, device_type = $3, maintenance_history = $4, operating_system = $5, serial_number = $6 WHERE id = $1 ',
        values: [id, device_name, device_type, maintenance_history, operating_system, serial_number],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book updated successfully." })
        }
    });
})
// User's loans
router.get('/loanedBooks/:id', async (req, res) => {
    const query = {
        text: 'SELECT * FROM book JOIN book_to_customer ON book_to_customer.book_id=book.id WHERE book_to_customer.customer_id = $1',
        values: [req.params.id],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while retrieving the data.' });
        } else {
            res.status(201).json(results.rows)
        }
    });
})

router.get('/loanedDevices/:id', async (req, res) => {
    const query = {
        text: 'SELECT * FROM device JOIN device_to_customer ON device_to_customer.device_id=device.id WHERE device_to_customer.customer_id = $1',
        values: [req.params.id],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while retrieving the data.' });
        } else {
            res.status(201).json(results.rows)
        }
    });
})

router.get('/loanedMedia/:id', async (req, res) => {
    const query = {
        text: 'SELECT * FROM media JOIN media_to_customer ON media_to_customer.media_id=media.id WHERE media_to_customer.customer_id = $1',
        values: [req.params.id],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while retrieving the data.' });
        } else {
            res.status(201).json(results.rows)
        }
    });
})

// User's holds
router.get('/heldBooks/:id', async (req, res) => {
    const query = {
        text: 'SELECT * FROM book JOIN hold_to_book ON hold_to_book.book_id=book.id WHERE hold_to_book.customer_id = $1 AND held_until > current_timestamp',
        values: [req.params.id],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while retrieving the data.' });
        } else {
            res.status(201).json(results.rows)
        }
    });
})

router.get('/heldDevices/:id', async (req, res) => {
    const query = {
        text: 'SELECT * FROM device JOIN hold_to_device ON hold_to_device.device_id=device.id WHERE hold_to_device.customer_id = $1 AND held_until > current_timestamp',
        values: [req.params.id],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while retrieving the data.' });
        } else {
            res.status(201).json(results.rows)
        }
    });
})

router.get('/heldMedia/:id', async (req, res) => {
    const query = {
        text: 'SELECT * FROM media JOIN hold_to_media ON hold_to_media.media_id=media.id WHERE hold_to_media.customer_id = $1 AND held_until > current_timestamp',
        values: [req.params.id],
    };
    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while retrieving the data.' });
        } else {
            res.status(201).json(results.rows)
        }
    });
})

// Create
router.post('/createBook', async (req, res) => {
    const { userId, condition_book, isbn, book_title, year_book, edition, genre } = req.body;

    const queryPublisher = {
        text: "SELECT * FROM publisher WHERE customer_id = $1",
        values: [userId]
    }
    const results = await (await pool.query(queryPublisher))
    const publisherId = results.rows[0].id

    const query = {
        text: 'INSERT INTO Book(publisher_id, condition, isbn, title, release_year, edition, genre) VALUES($1, $2, $3, $4, $5, $6, $7)',
        values: [publisherId, condition_book, isbn, book_title, year_book, edition, genre],
    };

    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Book added successfully." })
        }
    });
})

router.post('/createMedia', async (req, res) => {
    const { userId, media_title, file_link, file_type, author, file_size } = req.body;

    const queryPublisher = {
        text: "SELECT * FROM publisher WHERE customer_id = $1",
        values: [userId]
    }
    const results = await (await pool.query(queryPublisher))
    const publisherId = results.rows[0].id


    const query = {
        text: 'INSERT INTO media(publisher_id, title, file_link, file_type, author, upload_day, file_size) VALUES($1, $2, $3, $4, $5, current_date, $6)',
        values: [publisherId, media_title, file_link, file_type, author, file_size],
    };

    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Media added successfully." })
        }
    });
})

router.post('/createDevice', async (req, res) => {
    const { userId, device_type, device_name, manufacturer, year_publish, serial_number, operating_system, maintenance_history } = req.body;

    const queryPublisher = {
        text: "SELECT * FROM publisher WHERE customer_id = $1",
        values: [userId]
    }
    const results = await (await pool.query(queryPublisher))
    const publisherId = results.rows[0].id

    const query = {
        text: 'INSERT INTO device(publisher_id, device_type, device_name, manufacturer, year_publish, serial_number, operating_system, maintenance_history) VALUES($1, $2, $3, $4, $5, $6, $7, $8)',
        values: [publisherId, device_type, device_name, manufacturer, year_publish, serial_number, operating_system, maintenance_history],
    };

    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while inserting the data.' });
        } else {
            res.status(201).json({ message: "Device added successfully." })
        }
    });
})

// Delete
router.delete('/deleteBook/:id', async (req, res) => {
    const bookId = req.params.id;

    const query = {
        text: 'DELETE FROM book WHERE id = $1',
        values: [bookId],
    };

    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while deleting the data.' });
        } else {
            res.status(201).json({ message: "Book deleted successfully." })
        }
    });
})

router.delete('/deleteDevice/:id', async (req, res) => {
    const deviceId = req.params.id;

    const query = {
        text: 'DELETE FROM device WHERE id = $1',
        values: [deviceId],
    };

    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while deleting the data.' });
        } else {
            res.status(201).json({ message: "Device deleted successfully." })
        }
    });
})

router.delete('/deleteMedia/:id', async (req, res) => {
    const mediaId = req.params.id;

    const query = {
        text: 'DELETE FROM media WHERE id = $1',
        values: [mediaId],
    };

    await pool.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.status(500).json({ error: 'An error occurred while deleting the data.' });
        } else {
            res.status(201).json({ message: "Media deleted successfully." })
        }
    });
})
module.exports = router
