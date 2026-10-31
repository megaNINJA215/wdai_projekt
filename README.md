Link do strony:\
https://wdai-projekt.vercel.app/

#

W pierwszej kolejności zająłem się implementacji mechanik i funkcjonalności niewidocznych na użytkownika jak np. API, system autoryzacji użytkowników itp. itd., więc mimo że jakaś mechanika może istnieć to póki co może ona być niewidoczna

## backend

na chwilę obecną zrobione jest:

- [x] Autentykacja użytkownika:
    - tworzenie nowego konta
    - logowanie się do już istniejącego konta
    - możliwość wylogowania się
    - synchronizacja autentykacji (po wylogowaniu/zalogowaniu się jest to automatycznie aktualizowane na wszystkich otwartych oknach przeglądarki)
- [x] społeczności:
    - możliwość założenia nowej społeczności
    - możliwość dołączenia lub wyjścia ze społeczności
    - możliwość edytowania opisu społeczności (tylko jeśli jest się jej właścicielem)
    - pozyskania informacji do wyświetlenia społeczności
- [x] posty:
    - możliwość tworzenia nowych postów z lub bez przypisanej społeczności
    - możliwość edytowania posta jeśli jest się jego autorem
    - możliwość pobierania postów danego użytkownika, z społeczności lub spersonalizowanych (czyli z społeczności do ktorych się należy), na chwilę obecną pobierają się tylko od najnowszych
        - wyświetlanie postów wspiera infinity scroll, jeśli w danej społeczności znajduje się np. 100 postów ( c/test ) to chcąc je wyświetlić nie pobierzemy wszystkich naraz tylko 30 (w kolejności od najnowszego), po zjechaniu na dół strony gdzie znajduje się koniec listy tych 30 postów automatycznie zostanie pobrane kolejne 30 z nich i tak aż do wyświetlenia wszystkich dostępnych postów
    - możliwość formatowania tekstu wyświetlanego w postach, obejmuje to:
        - **pogrubienie tekstu**
        - _przechylenie tekstu_
        - ~~przekreślenie tekstu~~
        - `bloki kodu` aby podświetlić składnię
        - zagnieżdżania [linków](https://wdai-projekt.vercel.app/) w tekście
- [x] wyszukiwanie:
    - możliwość wyszukania użytkowników, postów oraz społeczności zawierających jakąś wzmiankę/tekst w swojej nazwie (lub tytule w przypadku postów)
    - podpowiedzi uzupełniania, gdy w searchbarze wpisze się np. "test" to wyświetli się do 5 społeczności i użytkowników zawierających tą frazę

**ze względu na hostowanie strony na vercel oraz ograniczonego miejsca w darmowym hostingu bazy danych na chwilę obecną postanowiłem wstrzymać się z możliwością ustawiania własnego zdjęcia profilowego / zdjęcia społeczności i zamiast tego generowane są wzory za pomocą zewnętrznej biblioteki**

## frontend ui/ux

na chwilę obecną zrobione jest:

- [x] generalny layout zawierający elementy takie jak sidebar czy header wyświetlane na prawie każdej stronie
    - [x] header
    - [ ] sidebar (jest widoczny, brak zawartości)
- [x] działający searchbar w headerze z podpowiedziami uzupełnienia
- [x] responsywność, jak tworzę nowy komponent od razu zwracam uwagę na to jak będzie wyglądać zarówno na komputerze jak i na urządzeniach mobilnych
- [x] wyświetlanie spersonalizowanych postów na głównej stronie
    - losowe, najnowsze gdy jest się niezalogowanym
    - z społeczności których jest się członkiem jeśli jest się zalogowanym
- [x] wyświetlanie konkretnego postu

na dniach będzie implementowane (kolejność losowa):

- [ ] strona do logowania się i/lub zakładania nowego
- [ ] uzupełnienie sidebaru
    - logo/nazwa projektu
    - możliwość stworzenia posta bez przypisanej społeczności
    - możliwość stworzenia nowej społeczności
    - lista społeczności których jest się członkiem
    - lista "odkrywaj" kilku losowych społeczności których nie jest się członkiem
- [ ] wyświetlanie społeczności
    - wyświetlanie podstawowych informacji o społeczności jak np. nazwa, opis, liczba członków
    - wyświetlanie postów przypisanych do danej społeczności
    - możliwość dołączenia/opuszczenia danej społeczności
    - (czysto informacyjnie, nie trzeba być jej członkiem aby móc ją wyświetlać, natomiast trzeba być aby móc publikować w niej posty oraz aby wyświetlały się ona na stronie głównej)
    - możliwość edycji opisu społeczności jeśli jest się jej właścicielem
- [ ] wyświetlanie użytkowników
    - wyświetlanie publicznych informacji o użytkowniku
    - wyświetlanie postów danego użytkownika (niezależnie od przypisanej społeczności lub jej braku)
- [ ] wyświetlanie wyszukiwanych treści
    - jeśli skorzystało się z podpowiedzi to przeniesie ona bezpośrednio na profil innego użytkownika/społeczności, co jest już zaimplementowane
    - jeśli postanowi się po prostu wyszukać jakiś tekst będą się wyświetlać posty, społeczności i użytkownicy zawierający wyszukiwaną wzmiankę
    - jeśli chodzi o wyszukiwanie to na chwilę obecną:
        - nie ma żadnej implementacji ui/ux umożliwiającej wyświetlanie postów, a znajdowanie społeczności i użytkowników dostępne jest tylko poprzez podpowiedzi uzupełniania
        - dostępne społeczności:
            - wdai
            - boni (dla kontekstu, Boni to imie mojego pieska)
            - test
            - testy
            - testing
        - dostępni użytkownicy:
            - megaNINJA215
            - megaBONI215
            - od test_user_1 do test_user_100
- [ ] możliwość edycji tytułu/opisu jeśli jest się jego autorem
