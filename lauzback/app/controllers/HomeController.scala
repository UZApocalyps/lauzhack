package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.mvc.Results._
import play.filters.csrf._
import play.filters.csrf.CSRF.Token

import java.util.UUID._
import play.api.libs.json.{JsValue, Json}
import net.liftweb.json.DefaultFormats
import net.liftweb.json._
import classes.{Article, Ticket}
import akka.stream.javadsl.{Flow, Sink, Source}
import models.DatabaseExecutionContext

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.db.Database

import java.sql.Statement
import javax.inject.Inject
import scala.concurrent.Future

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(db: Database, databaseExecutionContext: DatabaseExecutionContext, val controllerComponents: ControllerComponents) extends BaseController {

  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def index() = Action { implicit request: Request[AnyContent] =>
    
    Ok(views.html.index())
  }

  def login() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.login())
  }

  def ticket2() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.ticket())
  }

  def home() = Action { implicit request: Request[AnyContent] =>
    Ok(views.html.home())
  }

  def shopping() = Action { implicit request: Request[AnyContent] =>
    
    Ok(views.html.shopping())
  }

  def ticket(uid: String, ticket_id: String):Action[AnyContent] = Action.async { request =>
    Future {
      db.withConnection { conn =>
        val s = conn.createStatement()

        val chatte = s.execute(s"SELECT * FROM receipt_entry WHERE receipt_id = $ticket_id")

        // iterate over the result set
        val resultSet = s.getResultSet
        var entries2 = List[JsValue]()
        while (resultSet.next()) {
          val entry = Article(resultSet.getString("produce_name"), resultSet.getString("unit_price"), resultSet.getString("quantity"))
          entries2 = Json.obj("name" -> entry.name, "price" -> entry.price, "quantity" -> entry.quantity) :: entries2
        }

        Ok(Json.obj("id" -> ticket_id, "shopName" -> "Lidl", "articles" -> entries2))
      }
    }(databaseExecutionContext)
  }

  def poll(): Action[AnyContent] = Action.async { request =>
    Future {
      db.withConnection { conn =>
        val s = conn.createStatement()

        val uuuh =  request.body.asJson.get("id").asOpt[String].get

        val chatte = s.execute("SELECT id FROM receipt WHERE id = " + uuuh + " AND user_id IS NOT NULL")
        val pfff = s.getResultSet.getString("id")


        Ok(Json.toJson(if(pfff == null) "0" else "1"))
      }
    }(databaseExecutionContext)
  }

  def tickets(uid: String): Action[AnyContent] = Action.async { request =>
    println("bite au cul")
    Future {
      db.withConnection { conn =>
        val s = conn.createStatement()

        var toto = List[JsValue]()
        val chatte = s.execute(s"SELECT id FROM receipt WHERE user_id=\"" + uid + "\"")
        val resultSet = s.getResultSet
        var  ids = List[String]()
        while (resultSet.next()) {
          val id = resultSet.getString("id")
          ids = id :: ids
        }

        for(id <- ids) {
          val chattouille = s.execute("SELECT * FROM receipt_entry WHERE receipt_id = " + id)

          // iterate over the result set
          val resultSet2 = s.getResultSet
          var entries2 = List[JsValue]()
          while (resultSet2.next()) {
            val entry = Article(resultSet2.getString("produce_name"), resultSet2.getString("unit_price"), resultSet2.getString("quantity"))
            entries2 = Json.obj("name" -> entry.name, "price" -> entry.price, "quantity" -> entry.quantity) :: entries2
          }

          toto =  Json.obj("id" -> id, "shopName" -> "Lidl", "articles" -> Json.arr(entries2)) :: toto
        }

        Ok(Json.arr(toto))
      }
    }(databaseExecutionContext)
  }


  def createTicket():Action[AnyContent] = Action.async { request =>
    Future {
      db.withConnection { conn =>
        println(request.body)
        var uuid: String = ""
        uuid = java.util.UUID.randomUUID.toString()

        var result = Seq(uuid)

        println(uuid)

        implicit val formats = DefaultFormats

        val jsonString: String = request.body.asJson.mkString

        val json = net.liftweb.json.parse(jsonString)


        val m = json.extract[Ticket]



        val s = conn.createStatement()
        val bite = s.execute("SELECT id FROM store WHERE name = '" + m.shopName + "'")
        val shopId = s.getResultSet.getString("id")

        val res = s.execute(s"INSERT INTO receipt(store_id) VALUES($shopId)", Statement.RETURN_GENERATED_KEYS)
        val key = s.getGeneratedKeys.getInt(1)

        println(key)

        for(yep <- m.articles) {
          val s2 = conn.createStatement()
          val res2 = s2.execute(s"INSERT INTO receipt_entry(receipt_id, produce_name, unit_price, quantity) VALUES($key, '${yep.name}', ${yep.price}, ${yep.quantity})")
        }

        val resultSet = s.getResultSet


        Ok(Json.toJson(key));
      }
      }(databaseExecutionContext)
    }
  }