[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<p align="center">
  <!-- <a href="https://github.com/egrzeszczak/programowanie-systemow-webowych">
    <img src="s2.png" alt="Logo">
  </a>
  <a href="https://github.com/egrzeszczak/programowanie-systemow-webowych">
    <img src="s1.png" alt="Logo">
  </a> -->

  <h2 align="center">Programowanie Systemów Webowych</h3>
  <h3 align="center">System zarządzania usługami IT</h3>

  <p align="center">
    <a href="https://github.com/egrzeszczak/programowanie-systemow-webowych"><strong>Dokumentacja »</strong></a>
    <br />
    <br />
    <a href="https://github.com/egrzeszczak">Demo</a>
    ·
    <a href="https://github.com/egrzeszczak/programowanie-systemow-webowych/issues">Zgłoś problem</a>
  </p>
</p>

## Spis treści

* [Opis projektu](#opis-projektu)
    * [Stack](#stack)
    * [Wybrane moduły](#wybrane-moduly)
      * [Struktura HTML5](#struktura-html5)
      * [Formularz](#formularz)
      * [Web storage](#web-storage)
      * [Drag & Drop](#drag--drop)
      * [Rest API](#rest-api)
      * [Workery](#workery)
* [Uruchomienie](#uruchomienie)
    * [Wymagane środowisko](#wymagane-srodowisko)
    * [Instalacja](#instalacja)
* [Licencja](#licencja)
* [Kontakt](#kontakt)

## Opis projektu

Projekt jest warunkiem zaliczenia przedmiotu **Programowanie Systemów Webowych** który jest oparty na wybranych przez studenta funkcjonalnościach poniżej:

- struktura HTML5
- formularz
- web storage 
- drag & drop 
- rest API
- workery

### Stack

<p align="left">
    <img src="https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/javascript/javascript-original.svg" width=32 height=32 style="margin: 0 0.5em 0 0.5em; flex: 1">
    <img src="https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/express/express-original.svg" width=32 height=32 style="object-fit: cover; margin: 0 0.5em 0 0.5em; flex: 1">
    <img src="https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/tailwindcss/tailwindcss-plain.svg" width=32 height=32 style="object-fit: cover; margin: 0 0.5em 0 0.5em; flex: 1">
    <img src="https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/mongodb/mongodb-original.svg" width=32 height=32 style="margin: 0 0.5em 0 0.5em; flex: 1">
    <img src="https://raw.githubusercontent.com/devicons/devicon/2ae2a900d2f041da66e950e4d48052658d850630/icons/redis/redis-original.svg" width=32 height=32 style="object-fit: cover; margin: 0 0.5em 0 0.5em; flex: 1">
</p>


### Wybrane moduly

#### Struktura HTML5

- Strukutra HTML5 dzięki silnikowi wyświetlania `ejs`
- Framework `TailwindCSS` do stylizacji HTML

#### Formularz

- Logowanie
- Rejestracja
- Tworzenie wniosków
- Zamieszczanie komentarza, uwag do prac
- Zamieszczanie załączników

#### Web storage 

- Moduł autentyfikacji (`JWT`): 
  - logowanie
  - przechowywanie tokenu sesji

#### Drag & Drop 

- Widok tablicy i kolejki zgłoszeń, *drag & drop* można wykorzystać do dispatchowania zgłoszeń pomiędzy specjalistami ds. wsparcia (`Vue.js`)
- Przekazywanie załączników (`Vue.js`)

#### Rest API

- Aplikacja wykorzystuje Rest API do komunikacji z bazą danych (`MongoDB`)
- Wykorzystanie Rest API do weryfikacji tokenów JWT (`Redis`)

#### Workery

- Po stronie serwera automatyczne zamykanie nieaktywnych zgłoszeń
- Komunikaty wysyłane poprzez SMTP

## Uruchomienie

### Wymagane srodowisko

TBD

### Instalacja

1. `git clone github.com/egrzeszczak/programowanie-systemow-webowych`
2. `npm install`
3. Konfiguracja bazy danych w `./config/database.js`
4. `npm run dev` albo ~~`npm run build`~~

## Licencja

Licencja jest dostępna w pliku `LICENSE`

## Kontakt

Ernest Grzeszczak - ernest.grzeszczak@gmail.com

Link do projektu: [https://github.com/egrzeszczak/programowanie-systemow-webowych](https://github.com/egrzeszczak/programowanie-systemow-webowych)


[contributors-shield]: https://img.shields.io/github/contributors/egrzeszczak/programowanie-systemow-webowych.svg?style=flat-square
[contributors-url]: https://github.com/egrzeszczak/programowanie-systemow-webowych/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/egrzeszczak/programowanie-systemow-webowych.svg?style=flat-square
[forks-url]: https://github.com/egrzeszczak/programowanie-systemow-webowych/network/members
[stars-shield]: https://img.shields.io/github/stars/egrzeszczak/programowanie-systemow-webowych.svg?style=flat-square
[stars-url]: https://github.com/egrzeszczak/programowanie-systemow-webowych/stargazers
[issues-shield]: https://img.shields.io/github/issues/egrzeszczak/programowanie-systemow-webowych.svg?style=flat-square
[issues-url]: https://github.com/egrzeszczak/programowanie-systemow-webowych/issues
[license-shield]: https://img.shields.io/github/license/egrzeszczak/programowanie-systemow-webowych.svg?style=flat-square
[license-url]: https://github.com/egrzeszczak/programowanie-systemow-webowych/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/ernest-grzeszczak-081850187/
