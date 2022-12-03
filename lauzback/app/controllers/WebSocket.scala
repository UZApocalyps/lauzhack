package controllers

import play.api.mvc._
import play.api.libs.streams.ActorFlow

import javax.inject.Inject
import akka.actor.ActorSystem
import akka.stream.Materializer
import play.api.mvc._
import akka.stream.scaladsl._
import play.api.libs.json.Json
import play.api.libs.json.Json.toJson

import scala.concurrent.duration.DurationInt


class WebSocket @Inject() (cc: ControllerComponents)(implicit system: ActorSystem, mat: Materializer)
  extends AbstractController(cc) {

  @Inject() var controller: ReceiptController = _

  def socket = WebSocket.accept[String, String] { request =>
    Flow[String].map { msg =>
      println(msg)
      // call controller.isRegistered every 5 seconds and return the result
      Source.tick(0.seconds, 5.seconds, msg).map { _ =>
        println(controller.isRegistered(msg) + "bite")
      }
      "I received your message: " + msg
    }
  }


    /*request =>
    Flow[String].map { msg =>
      val json = Json.parse(msg)
      val channel = (json \ "channel").asOpt[String]
      val data = (json \ "data").asOpt[String]

      if(channel.isEmpty || data.isEmpty) {
        Json.toJson(
          Map(
            "channel" -> toJson("/wut"),
            "data" -> toJson("Invalid request")
          )
        ).toString()
      }
      else {
        println(msg)


        Json.toJson(
          Map(
            "channel" -> toJson(channel),
            "data" -> toJson("Hello " + data.get)
          )
        ).toString()
      }
    }
  }
  */
}