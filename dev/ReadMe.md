0. `git submodule update --init`
1. Install npm if needed: `brew install npm`
2. Install vsce if needed: `npm install -g vsce`
3. For zsh: `echo 'source ~/.zshrc' > ~/.zshenv`
4. Install packages for extension: `npm install`
5. `npm run compile`
6. Create extension package locally: `vsce package`
7. Publish extesion`vsce publish`