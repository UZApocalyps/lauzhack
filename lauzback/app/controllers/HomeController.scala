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



        /*
        val bite = s.execute(s"SELECT * FROM ticket WHERE id = $ticket_id AND user_id = '$uid'")
        // get ticket date from result set
        val resultSet2 = s.getResultSet

        val ticket: Ticket = new Ticket("bite", entries.toArray)
*/

        Ok(Json.obj("shopName" -> "Lidl", "articles" -> entries2))
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

        val res = s.execute(s"INSERT INTO receipt(id, date, store_id, user_id) VALUES(NULL, NULL, $shopId, NULL)", Statement.RETURN_GENERATED_KEYS)
        val key = s.getGeneratedKeys.getInt(1)

        println(key)

        for(yep <- m.articles) {
          val s2 = conn.createStatement()
          val res2 = s2.execute(s"INSERT INTO receipt_entry(id, receipt_id, produce_name, unit_price, quantity) VALUES(NULL, $key, '${yep.name}', ${yep.price}, ${yep.quantity})")
        }

        val resultSet = s.getResultSet


        Ok(Json.toJson(result));
      }
      }(databaseExecutionContext)
    }
  }