import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded( { extended:true } ));
app.use(bodyParser.json());

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');

let formattedDate = `${year}-${month}-${day}`;

const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

let posts = [
    {
      id: 1,
      title: "The Rise of Decentralized Finance",
      content:
        "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
      author: "Alex Thompson",
      date: "2023-08-01",
    },
    {
      id: 2,
      title: "The Impact of Artificial Intelligence on Modern Businesses",
      content:
        "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
      author: "Mia Williams",
      date: "2023-08-05",
    },
    {
      id: 3,
      title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
      content:
        "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
      author: "Samuel Green",
      date: "2023-08-10",
    },
];

app.get('/posts', (req, res) => {
    res.json(posts);
});

app.get('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts.find(p => p.id === id);

    if (post === undefined) {
        res.status(400).json({ error: "Invalid request(ID does not exist)"});
        return;
    } 

    res.json(post);
});

app.get('/random', (req, res) => {
    const idx = Math.floor(Math.random() * posts.length);
    res.json(posts[idx]);
});

app.post('/posts', (req, res) => {
    const { title, content, author } = req.body;

    if (title === undefined || content === undefined || author === undefined) {
        res.status(400).json({ error: "Incomplete data"});
        return;
    }
    const newPost = {
        id: parseInt(posts[posts.length - 1].id) + 1,
        title: title,
        content: content,
        author: author,
        date: formattedDate   
    }

    posts.push(newPost);
    res.json(newPost);
});

app.put('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, author } = req.body;
    const reqId = posts.findIndex(p => p.id === id);

    if ( title === undefined || content === undefined || author === undefined || reqId === undefined ) {
        res.status(400).json({ error: "Incomplete data"});
        return;
    }

    posts[reqId].title = req.body.title;
    posts[reqId].content = req.body.content;
    posts[reqId].author = req.body.author;
    posts[reqId].date = formattedDate;

    res.json(posts[reqId]);
});

app.patch('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, content, author } = req.body;
    const reqId = posts.findIndex(p => p.id === id);

    if (reqId === undefined) {
        res.status(400).json({ error: "Incomplete data"});
        return;
    }

    const patchPost = {
        id: posts[reqId].id,
        title: req.body.title || posts[reqId].title,
        content: req.body.content || posts[reqId].content,
        author: req.body.author || posts[reqId].author,
        date: formattedDate
    }

    posts[reqId] = patchPost;

    res.json(posts[reqId]);
});

app.delete('/posts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const reqId = posts.findIndex(p => p.id === id);

    if (reqId === undefined) {
        res.status(400).json({ error: "Incomplete data"});
        return;
    }

    const deletedPost = posts.splice(reqId, 1);
    res.json(deletedPost);
});

app.delete('/all', (req, res) => {
    if (masterKey === req.query.key) {
        posts = [];
        res.status(200).json(posts);
        return;
    }

    res.status(400).json({ error: "Invalid request(invalid key value)."});
});

app.listen(port, () => {
    console.log(`Running on -> http://localhost:${port}`);
});

