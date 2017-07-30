# Unofficial Todoist Gnome Shell extension

This is an unofficial Gnome Shell extension which displays the number of currently open tasks in the top right corner of your Gnome Shell.

It has not yet been submitted to the Gnome Shell extension directory and might never be as this is more a playground for experimenting with Gnome Shell. However that might change in the future.

Being an absolute beginner when it comes to programming for Gnome the extension's code has been heavily influenced by [this](http://smasue.github.io/gnome-shell-tw) and [this](http://www.mibus.org/2013/02/15/making-gnome-shell-plugins-save-their-config/) blogpost. Kudos to the authors! :)

![Screenshot](assets/todoist-gnome-shell-extension.png?raw=true "Screenshot")

# Setup

Clone the repository to `~/.local/share/gnome-shell/extensions/` into a folder named `todoist@ubuntudroid.gmail.com` using the following command:

    git clone https://github.com/ubuntudroid/todoist-gnome-shell-extension.git todoist@ubuntudroid.gmail.com
    
The name of the directory is important because Gnome Shell won't recognize the extension otherwise.

Then restart Gnome Shell (ALT-F2 and then 'r') and navigate to https://extensions.gnome.org/local/. You can enable the extension and specify your Todoist API token there.

Currently the extension syncs every 60 seconds, but I'll probably also make this configurable via the settings later. That means it could take up to one minute before the task count appears after setting the API token in the settings.
