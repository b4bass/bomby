RAILS SIDE
------------
bundle install --without production
rake db:create
rake db:migrate
rails s

NODE SIDE
-----------
cd node/
npm install
node server.js