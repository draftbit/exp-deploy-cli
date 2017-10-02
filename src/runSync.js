const SYNC_FIELDS = [
  'name',
  'privacy',
  'slug',
  'scheme',
  'version'
]

function runSync (options) {
  console.log('running sync', options)
  process.exit()
}

module.exports = runSync;
