import { useState } from 'react'
import { 
  Router, Routes, Route, Link, useMatch
} from 'react-router-dom'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create' style={padding}>create new</Link>
      <Link to='/about' style={padding}>about</Link>
    </div>
  )
}

const Notification = ({ message }) => {
  return ( 
    <div>
      {message}
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} ><Link to={`/anecdote/${anecdote.id}`}>{anecdote.content}</Link></li>)}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div style={{marginTop: '16px'}}>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')


  const handleSubmit = (e) => {
    e.preventDefault()

    const anecdote = {
      content,
      author,
      info,
      votes: 0
    }

    props.addNew(anecdote)
    props.setShowNotification(true);
    props.setNotificationMessage(`The anecdote ${anecdote.content} has been added to the anecdote list`)

    setTimeout(() => {
      props.setShowNotification(false);
      props.setNotificationMessage('')
    }, 5000)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e)=> setInfo(e.target.value)} />
        </div>
        <button>create</button>
      </form>
    </div>
  )

}

const Anecdote = (anecdote) => {
    return (
      <div>
        <h3>{anecdote.anecdote.content} by {anecdote.anecdote.author}</h3>
        <div>has {anecdote.anecdote.votes} votes</div>
        <div>for more info see <a href={anecdote.anecdote.info}>{anecdote.anecdote.info}</a></div>
      </div>
    )
}

const App = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState(false);
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const match = useMatch('/anecdote/:id')
  const anecdote = match ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id)) : null

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) => anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  console.log(showNotification,' showNotification ')
  console.log(notificationMessage, ' notificationMessage ')

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {showNotification && <Notification message={notificationMessage}/>}
      <Routes>
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes}/>}/>
        <Route path='/anecdote/:id' element={<Anecdote anecdote={anecdote}/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/create' element={<CreateNew setNotificationMessage={setNotificationMessage} setShowNotification={setShowNotification} addNew={addNew}/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
