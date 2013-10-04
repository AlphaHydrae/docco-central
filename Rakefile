require 'rake'
require 'tmpdir'

desc 'Update GitHub pages (from develop).'
task :pages do |t|

  remote = 'git@github.com:AlphaHydrae/docco-central.git'

  Dir.mktmpdir 'docco-central-' do |tmp|

    repo = File.join tmp, 'repo'
    Dir.mkdir repo
    raise 'ERROR: could not clone repo' unless system "git clone -b develop #{remote} #{repo}"

    raise 'ERROR: could not install packages' unless system "cd #{repo} && npm install"

    docs = File.join tmp, 'docs'
    Dir.mkdir docs
    bin = File.join repo, 'bin', 'docco-central'
    raise 'ERROR: could not generate docs' unless system "cd #{repo} && #{bin} --output #{docs} lib/*.js lib/**/*.js"

    raise 'ERROR: could not checkout gh-pages' unless system "cd #{repo} && git checkout -b gh-pages origin/gh-pages"
    raise 'ERROR: could not clean gh-pages' unless system "cd #{repo} && rm -fr *"
    raise 'ERROR: could not copy docs' unless system "cd #{tmp} && cp -R #{docs}/* #{repo}"
    raise 'ERROR: could not stage changes' unless system "cd #{repo} && git add -A"
    raise 'ERROR: could not stage changes' unless system "cd #{repo} && git ls-files --deleted -z | xargs -0 git rm"

    h = `cd #{repo} && git log --pretty=format:'%h' -n 1`
    raise 'ERROR: could not commit changes' unless system %/cd #{repo} && git commit -m "Generated from develop@#{h}."/
    raise 'ERROR: could not push changes' unless system "cd #{repo} && git push"
  end
end

# version tasks
require 'rake-version'
RakeVersion::Tasks.new do |v|
  v.copy 'package.json', '.docco-central.json'
end
