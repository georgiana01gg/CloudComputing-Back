#Documentație Proiect Cloud Computing

##Introducere
Scopul acestei aplicații este gestiunea unei baza de date atribuită unor jurnale. Așadar, utilizatorii pot accesa plicația pentru a introduce noi mesaje pentru anumite zile, așa cum ar scrie într-un jurnal fizic.
Pentru asta, utilizatorii trebuie să poată insera numele, e-mail-ul, data evenimentului, subiectul cu care pot identifica ziua respectivă și conținutul textului din jurnal.

În plus, dupa introducerea unui nou mesaj, utilizatorul poate vedea o notificare în partea stângă a ecranului conform căreia mesajul său a fost adăugat cu succes în jurnal.
Imediat ce înregistrarea a fost adăugată, un mesaj de alerta va apărea pe ecran și va ghida utilizatorul să apese „refresh” pentru a vizualizarea notificarea amintită anterior.




##Descriere problemă
Pentru dezvoltarea acestei aplicații, am creat două proiecte diferite, unul de backend și unul de frontend care comunică unul cu altul.
Inițial, am creat o mașină virtuală cu ajutorul Platformei Google Cloud. Ulterior, am creat un user și o bază de date asociată acestei mașini virtuale și am configurat o bază de date în MySql pe care am asociat-o acestei VM.
 
Am setat conexiunile necesare în fișierul .env pentru a securiza aplicația, și am creat propriu zis proiectul de backend.
Pentru simplificare, am creat două foldere numite „utils” și „router” în care am inclus fișierele de tip .js.
  
În fișierul router, am creat toate REST API-urile necesare gestiunii bazei de date: GET, POST, PUT și DELETE. Dintre acestea am exemplificat în frontend GET și POST pentru inserarea unei noi înregistrări și afișarea tuturor înregistrărilor. Iar în fișierul imageRecognition, am implementat un serviciu cloud numit CloudVision de la Google Cloud prin care un link al unei imagini generează caracteristicile specifice și identifică culorile dominante. 

Pentru implementarea serviciului de CloudVision am utilizat un API din biblioteca Google Cloud, pentru care am creat o cheie pe care am inclus-o în directorul proiectului de backend. Pentru securitate, cheia a fost adăugată în fișierul .gitignore.
Partea de frontend a fost creată în așa fel încât userul să poată insera și vizualiza înregistrări. Vizualizarea înregistrărilor este sumară deoarece conținutul textului din jurnal este ascuns. Utilizatorul poate vizualiza doar numele persoanei care a inserat mesajul și subiectul acestuia.

##Descriere API
REST API-urile sunt utilizate ca un canal de comunicare între utilizator și baza de date. În interfață, utilizatorul are acces doar la endpoint-urile GET și POST. Mecanismul prin care funcționează aceste endpoint-uri este pe bază de request și response, având la bază un link htttp.
Pentru endpoint-ul GET, prin care sunt afișate toate mesajele din jurnal, este folosit URL-ul „http://localhost:8080/diary” accesat din front end cu ajutorul AXIOS. Același  URL este accesat și de endpoint-ul POST care inserează.
În plus, am creat endpoint-urile „GET labels” care returneaza caracteristicile și culorile unei imagini, „GET message by ID” care returnează un mesaj specific, accesând URL-ul „http://localhost:8080/diary/number”, „Update a message” care folosește REST API-ul de PUT și endpoint-ul „DELETE a message by ID”.
Tehnica request – response este cel mai bine ilustrată în cazul endpoint-ului de POST în cazul căruia request-ul se formează pe baza parametrilor oferiți de utilizator iar response-ul întoarce o nouă înregistrare către baza de date.

##Flux de date
Exemple de request / response
1.	Un utilizator introduce o nouă filă în jurnalul său introducând parametri în căsuțele din formularul de „Submit”
 
2.	Utilizatorul apasă pe butonul de „Submit” iar inregistrarea este creată cu succes atunci cand apare alerta următoare:
 
3.	Utilizatorul este îndrumat să apese refresh pentru a putea vizualiza notificarea conform căreia mesajul său a ajuns în baza de date împreună cu mesajele celorlalți utilizatori.
 
4.	Acum, cu o verificare în platforma PostMan putem identifica o nouă înregistrare.
 
##Metode HTTP
HTTP definește un set de metode de solicitare pentru a indica acțiunea dorită care trebuie efectuată pentru o anumită resursă. Metoda GET este folosită pentru a prelua informații de la serverul dat folosind un anumit URL. Solicitările care utilizează GET ar trebui să recupereze doar date și nu ar trebui să aibă niciun alt efect asupra acestora. Solicitarea POST este utilizată pentru a trimite date către server, de exemplu, informații despre clienți, încărcare de fișiere etc. folosind formulare HTML.
Metodele HTTP utilizate în mod practic în această aplicație sunt GET și POST, iar metoda GET BY ID este folosită în mod indirect în cadrul funcției de submit. Celelalte metode HTTP create, nu sunt implementate în frontend.
Autentificare și autorizare servicii utilizate
Nu este necesară autentificarea utilizatorilor, așadar orice persoană care accesează aplicația poate insera o nouă înregistrare șipoate vizualiza interfața grafică împreună cu notificările persoanelor care au adăgat mesaje la rândul lor.
Serviciile utilizate sunt, serviciul de stocare cloud oferit de Google prin mașina virtuală creată, serviciul de Cloud Vision și publicarea aplicației prin platforma Cloud Heroku.
