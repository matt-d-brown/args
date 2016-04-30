import parser from 'minimist'
import pkginfo from 'pkginfo'

class Commander {
  constructor() {
    this.args = parser(process.argv.slice(2))
    const parent = module.parent

    pkginfo(parent)
    const version = parent.exports.version

    this.details = {
      options: [],
      commands: []
    }

    if (version) {
      this.option('version', 'Output the version number', version)

      if (this.args.v || this.args.version) {
        console.log(version)
        process.exit()
      }
    }

    this.option('help', 'Output usage information')

    if (this.args._[0] == 'help' || this.args.h || this.args.help) {
      this.renderHelp()
    }
  }

  option (name, description, defaultValue) {
    let variants = []

    switch (name.constructor) {
      case String:
        variants[0] = name.charAt(0)
        variants[1] = name

        break
      case Array:
        variants.concat(name)
        break
      default:
        console.error(`Invalid name for option ${name}`)
    }

    this.details.options.push({
      usage: `-${variants[0]}, --${variants[1]}`,
      description
    })

    this.setProperties(variants, defaultValue)
    return this
  }

  setProperties (names, initial) {
    let value = false

    for (let name of names) {
      let fromArgs = this.args[name]

      if (fromArgs) {
        value = fromArgs
      }
    }

    for (let name of names) {
      this[name] = value
    }
  }

  renderHelp () {
    let usage = [
      '',
      'Usage: muffin [options] [command]',
      '',
      '',
      'Options:',
      ''
    ]

    for (let option of this.details.options) {
      usage.push(`  ${option.usage}  ${option.description}`)
    }

    usage.push('')
    console.log(usage.join('\n  '))

    process.exit()
  }
}

export default new Commander
