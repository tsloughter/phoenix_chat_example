web: elixir --name phoenix@`ip -4 -o addr show dev eth1 | awk '{print $4}' | cut -d/ -f1` --cookie webcookie -S mix phoenix.server
