package controllers

import akka.stream.javadsl.{Flow, Sink, Source}
import models.DatabaseExecutionContext

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.db.Database

import javax.inject.Inject
import scala.concurrent.Future

@Singleton
class ReceiptController @Inject()(db: Database, databaseExecutionContext: DatabaseExecutionContext, val controllerComponents: ControllerComponents)
  extends BaseController {

  def isRegistered(receiptId: String): Boolean = {
    db.withConnection { conn =>
      val s = conn.createStatement()
      val res = s.execute("SELECT COUNT(*) as x FROM receipt WHERE id = " + receiptId + " AND user_id IS NOT NULL")
      val out = s.getResultSet.getObject("x")
      conn.close()
      out != 0
    }
  }

  def registerReceipt(): Action[AnyContent] = Action.async { req =>
    Future {
      db.withConnection { conn =>
        req.body.asJson
        println(req.body.asRaw)
        val userId = req.body.asJson.get("uid").asOpt[String].get
        val receiptId = Integer.parseInt(req.body.asJson.get("id_Ticket").asOpt[String].get)

        // Check whether the receipt is already registered
        val s = conn.createStatement()
        val res = s.execute("SELECT id, user_id FROM receipt WHERE id = " + receiptId)
        val resultSet = s.getResultSet
        var uid = resultSet.getString("user_id")
        var rid = resultSet.getString("id")

        if(rid != null) {
          var s2 = conn.createStatement()
          val res = s2.execute("UPDATE receipt SET user_id = '" + userId + "' WHERE id = " + receiptId)
          val out = "Receipt registered"
          conn.close()
          Ok("{\"status\":\"ok\"}")
        }
        else {
          Ok("{\"status\":\"notok\"}")
        }
      }
    }(databaseExecutionContext)
  }
}
