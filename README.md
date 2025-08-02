[![Netlify Status](https://api.netlify.com/api/v1/badges/1e36e114-d961-4dfa-9d87-4f9485bd4ba4/deploy-status)](https://app.netlify.com/sites/simpsonsrandomizer/deploys)

# Simpsons Randomizer

Una web creada para los fans de Los Simpsons que quieran ver un episodio aleatorio de la serie.

Puedes usar la web [aquí](https://simpsonsrandomizer.netlify.app)

> [!NOTE]
> Los episodios se obtienen de webs de terceros, no son almacenados en ningún servidor.

## Previsualización

![Previsualización](https://i.imgur.com/BwT7URH.png)

## Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```shell
netlify dev
```

### Scripts

Para obtener la lista de episodios:

```shell
node --env-file .env scripts/generateEpisodes.js
```

> [!NOTE]
> * El script necesita una variable de entorno llamada `TMDB_API_TOKEN` que se debe obtener de [TMDB](https://www.themoviedb.org/settings/api)
> * Se necesita tener node `>20` para usar la flag `--env-file`
