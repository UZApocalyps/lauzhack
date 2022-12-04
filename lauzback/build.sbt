ThisBuild / scalaVersion := "2.13.10"

ThisBuild / version := "1.0-SNAPSHOT"

lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    name := """lauzback""",
    libraryDependencies ++= Seq(
      guice,
      jdbc,
      javaWs,
      "org.xerial" % "sqlite-jdbc" % "3.40.0.0",
      "org.scalatestplus.play" %% "scalatestplus-play" % "5.1.0" % Test
    ),
    fork in run := false,
    resolvers += "SQLite-JDBC Repository" at "https://oss.sonatype.org/content/repositories/snapshots",
  )
  libraryDependencies += "net.liftweb" %% "lift-json" % "3.5.0"
