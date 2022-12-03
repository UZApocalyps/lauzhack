package classes

import net.liftweb.json.DefaultFormats
import net.liftweb.json._

case class Ticket(
    shopName: String,
    articles: Array[Article]
)

case class Article (
    name: String,
    quantity: String,
    price: String,
)


object ParseJsonArray extends App {

  implicit val formats = DefaultFormats

  // a JSON string that represents a list of EmailAccount instances
  val jsonString ="""
{
  "shopName": "Lidle",
  "articles": [
    { 
      "name": "Bread",
      "quantity": 1,
      "price": 1.5
    },
    {
      "name": "Potatoe bread",
      "quantity": 1,
      "price": 1.5
    },
    {
      "name": "banana",
      "quantity": 1,
      "price": 1.5
    },
    {
      "name": "apple",
      "quantity": 1,
      "price": 1.5
    },
    {
      "name": "tin foil",
      "quantity": 1,
      "price": 1.5
    },
    {
      "name": "Water",
      "quantity": 1,
      "price": 1.5
    },
    {
      "name": "Coconut",
      "quantity": 1,
      "price": 1.5
    },
    {
      "name": "Milk",
      "quantity": 1,
      "price": 2.5
    },
    {
      "name": "Eggs",
      "quantity": 2,
      "price": 3.5
    }
  ]
}
"""



  // json is a JValue instance
  val json = parse(jsonString)


    val m = json.extract[Ticket]
    print(m.shopName)
//   val findShop = (json \\ "shopName").children
//   for(i<-findShop){
//     println(i.values)
//   }

//   val findArticle = (json \\ "name").children
//   for(i<-findArticle){
//     println(i.extract[Article])
//   }
  /*for (acct <- elements) {
    val m = acct.extract[Ticket]
    println(s"Articles: ${m.articles}")
  }*/

  
}