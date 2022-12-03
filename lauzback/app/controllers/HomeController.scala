package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.mvc.Results._
import play.filters.csrf._
import play.filters.csrf.CSRF.Token
import java.util.UUID._
import play.api.libs.json.Json
import net.liftweb.json.DefaultFormats
import net.liftweb.json._
import classes.Ticket


/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(val controllerComponents: ControllerComponents) extends BaseController {

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




  def createTicket() = Action { implicit request: Request[AnyContent] =>

    println(request.body)
    var uuid: String = ""
    uuid = java.util.UUID.randomUUID.toString()
    
    var result = Seq(uuid)
    
    println(uuid)
    

    implicit val formats = DefaultFormats

    val jsonString: String = request.body.asJson.mkString

    val json = net.liftweb.json.parse(jsonString)


    val m = json.extract[Ticket]
    

    
    Ok(Json.toJson(result));
  }


  

  
}
