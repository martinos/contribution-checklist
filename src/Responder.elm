port module Responder exposing (..)

import Http
import Json.Decode as Json exposing ((:=))



-- MESSAGES


issueMessage : String
issueMessage = """

Thanks for the issue! Make sure you did everything on the [issue
checklist][checklist]. My human colleagues will appreciate it!

Commenters should keep [these things][participation] in mind. Everyone should
know about [batching work][expectations].

[checklist]: https://github.com/process-bot/the-process/blob/master/issues.md
[participation]: https://github.com/process-bot/the-process/blob/master/participation.md
[expectations]: https://github.com/process-bot/the-process/blob/master/expectations.md

"""


pullMessage : String
pullMessage = """

Thanks for the pull request! Make sure you did everything on the [pull request
checklist][checklist]. My human colleagues will appreciate it!

Commenters should keep [these things][participation] in mind. Everyone should
know about [batching work][expectations].

[checklist]: https://github.com/process-bot/the-process/blob/master/pulls.md
[participation]: https://github.com/process-bot/the-process/blob/master/participation.md
[expectations]: https://github.com/process-bot/the-process/blob/master/expectations.md

"""


-- UPDATE


type Msg
  = OpenIssue Issue
  | OpenPull Issue
  | NoOp


type alias Issue =
  { repo : String
  , number : Int
  }


update : Msg -> model -> (model, Cmd Msg)
update msg model =
  ( model, react msg )


react : Msg -> Cmd Msg
react msg =
  case msg of
    OpenIssue issue ->
      postComment issue issueMessage

    OpenPull issue ->
      postComment issue pullMessage

    NoOp ->
      Cmd.none


postComment : Issue -> String -> Cmd Msg
postComment {repo,number} message =
  let
    url =
      "https://api.github.com/repos/" ++ repo ++ "/issues/"
      ++ toString number ++ "/comments"

    body =
      "{ \"body\": \"" ++ message ++ "\" }"

    post =
      Http.send Http.defaultSettings
        { verb = "POST"
        , headers = []
        , url = url
        , body = Http.string body
        }
  in
    Task.perform (always NoOp) (always NoOp) post



-- SUBSCRIPTIONS


port events : (String -> msg) -> Sub msg


subscriptions : model -> Sub Msg
subscriptions =
  events decodeEvent



-- DECODERS


decodeEvent : String -> Msg
decodeEvent json =
  case Json.decodeString event json of
    Ok msg ->
      msg

    Err _ ->
      NoOp


event : Json.Decoder Msg
event =
  Json.oneOf [ issueOpened, pullOpened ]


issueOpened : Json.Decoder Msg
issueOpened =
  Json.map OpenIssue (issue "issue")


pullOpened : Json.Decoder Msg
pullOpened =
  Json.map OpenPull (issue "pull_request")


issue : String -> Json.Decoder Issue
issue kind =
  Json.map3 (always Issue)
    ("action" := opened)
    (Json.at [ "repository", "full_name" ] Json.string)
    (Json.at [ kind, "number" ] Json.int)


opened : Json.Decoder ()
opened =
  let
    check action =
      if action == "opened" then
        Json.succeed ()
      else
        Json.fail "Looking for \"opened\""
  in
    Json.andThen Json.string check
