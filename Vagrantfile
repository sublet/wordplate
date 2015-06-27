# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "Wordplate"
  config.vm.provision :shell, :path => "bin/bootstrap.sh"
  config.vm.box_url = "http://files.vagrantup.com/precise64.box"
  config.vm.network :forwarded_port, guest: 80, host: 8080
end

# To get multisite working you need to add it to ipfw utility
# Adding: sudo ipfw add 100 fwd 127.0.0.1,8080 tcp from any to any 80 in
# Viewing: sudo ipfw list
# Clearing All: sudo ipfw flush
# Clearing Single: sudo ipfw delete <NUMBER>
# 65535 allow ip from any to any