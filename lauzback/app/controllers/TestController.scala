package controllers

import models.DatabaseExecutionContext

import javax.inject._
import play.api._
import play.api.mvc._
import play.api.db.Database

import javax.inject.Inject
import scala.concurrent.Future

@Singleton
class TestController @Inject()(db: Database, databaseExecutionContext: DatabaseExecutionContext, val controllerComponents: ControllerComponents)
  extends BaseController {

  def getAll(): Action[AnyContent] = Action.async {
    Future {
      db.withConnection { conn =>
        // do whatever you need with the db connection
        Ok("Hello World")
      }
    }(databaseExecutionContext)
  }

  def updateSomething(): Action[AnyContent] = Action.async {
    Future {
      db.withConnection { conn =>
        val s = conn.createStatement()
        val res = s.execute("SELECT COUNT(*) as x FROM receipt")
        val out = "test" + s.getResultSet.getObject("x")
        conn.close()

        Ok(out)
      }
    }(databaseExecutionContext)
  }
}