
# Compile the Elm file
elm-make Responder.elm --yes --output=responder.js

# Start the node server
node server.js
