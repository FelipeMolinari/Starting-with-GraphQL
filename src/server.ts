import express from 'express'
import  {graphqlHTTP} from 'express-graphql'
import {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull} from 'graphql'

const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents a Author book of a book',
  fields: ()=>({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},

  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: ()=>({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    authorId:{type: GraphQLNonNull(GraphQLString)},
    author: { 
      type: AuthorType,
      resolve: (book)=>{
        return authors.find(author=>author.id===book.authorId)
      }
    }
  })
})



const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: "root query",
  fields: ()=> ({
    book: {
      type: BookType,
      description: "A single book",
      args:{
        id: {type: GraphQLInt}
      },
      resolve: (_,args)=>(books.find(book=>book.id===args.id))
    },
    author: {
      type: BookType,
      description: "A single Author",
      args:{
        id: {type: GraphQLInt}
      },
      resolve: (_,args)=>(authors.find(author=>author.id===args.id))
    },
    books: {
      type: new GraphQLList(BookType),
      description: "List of all books",
      resolve: ()=>(books)
    },
    authors:{
      type: new GraphQLList(AuthorType),
      description: "List of all authores",
      resolve: ()=>(authors)
    },

  })
})

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: ()=> ({
    addBook: {
      type: BookType, 
      description: 'Add a book',
      args:{
        name:{type: GraphQLNonNull(GraphQLString)},
        authorId:{type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (_, args)=>{
        const newBook = {id: books.length+1, name: args.name, authorId: args.authorId}
        console.log(newBook)
        books.push(newBook)
        return newBook;
      }
    },
    addAuthor: {
      type: BookType, 
      description: 'Add a author',

      args:{
        name:{type: GraphQLNonNull(GraphQLString)},
      },
      resolve: (_, args)=>{
        const newAuthor = {id: authors.length+1, name: args.name}
        authors.push(newAuthor)
        return newAuthor;
      }
    }
  })
})
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})
app.use('/graphql', graphqlHTTP({graphiql: true, schema}))
app.listen(5000, ()=>console.log("server running"))