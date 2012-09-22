worker_processes 4
timeout 30

after_fork do |server, worker| 
  defined?(ActiveRecord::Base) and 
  ActiveRecord::Base.establish_connection 
end