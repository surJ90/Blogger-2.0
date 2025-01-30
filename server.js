import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000"

app.use(bodyParser.urlencoded( { extended:true } ));
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const result = await axios.get(API_URL + "/posts");
        res.render('index.ejs', 
            {
                data: result.data
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch posts." });
    }
});

app.get('/new', (req, res) => {
    res.render('editor.ejs', 
        {
            heading: "Create Post",
            button: "Create Post"
        }
    );
});

app.get('/edit/:id', async (req, res) => {
    try {
        const result = await axios.get(API_URL + "/posts/" + req.params.id);
        res.render('editor.ejs',
            {
                heading: "Edit Post",
                data: result.data,
                button: "Update Post"
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Unable to fetch requested page." });
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        const result = await axios.delete(API_URL + "/posts/" + req.params.id);
        console.log(result.data);
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: "Unable to delete the post." });
    }
});


app.post('/posts/new', async (req, res) => {
    try {
        const result = await axios.post(API_URL + "/posts", req.body);
        console.log(result.data);
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: "Unable to upload the post." });
    }
});

app.post('/posts/:id', async (req, res) => {
    try {
        const result = await axios.patch(API_URL + "/posts/" + req.params.id, req.body);
        console.log(result.data);
        res.redirect('/');
    } catch (error) {
        res.status(500).json({ error: "Unable to update the post." });
    }
});

app.listen(port, () => {
    console.log(`Running on -> http://localhost:${port}`);
});