# realmwalker

## Development server

| Platform      | Instruction                                                                                                                                |
|---------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Browser       | Run `ionic serve` for a dev server. Navigate to `http://localhost:8100/`.                                                                  |
| iOS simulator | Run `ionic capacitor run ios -l --external` for a dev server. [Ionic iOS documentation](https://ionicframework.com/docs/v6/developing/ios) |

## Debugging against device

```bash
# Generate ssl certificate
mkcert localhost 127.0.0.1 ::1 192.168.x.x

# Run server
ionic serve --ssl --external

# Run app
ionic capacitor run android -l --ssl --external --host=192.168.x.x

# DevTools
chrome://inspect/#devices
```

## Build

TBD

## Resources

- Icons: [game-icons.net](https://game-icons.net/)
- More icons: [ionic.io](https://ionic.io/ionicons/)
- Even more icons: [uxwing.com](https://uxwing.com/)

## Further help

- Check out [Ionic docs](https://ionicframework.com/docs/)

- To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
