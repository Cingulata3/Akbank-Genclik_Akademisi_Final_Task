# Akbank Gençlik Akademisi Teknoloji Okuryazarlığı Bitirme Projesi
## ATM-RS (Recommendation System)
Günümüzde finansal işlemler için ATM'ler hayati bir rol oynamaktadır. Ancak kullanıcılar ATM'ye
 ulaşana kadar, ATM'nin durumu hakkında bilgi sahibi olamazlar. Örneğin, kullanıcılar ancak
 ATM'ye vardıklarında ATM'nin bozuk olduğunu veya bakımı yapılmadığı için arızadan kaynaklı
 kartlarını yutabileceğini öğrenebilirler. Bu sebeple kullanıcılar ATM seçerken birkaç faktörü göz
 önünde bulundurmak zorunda kalır: mesafe, güvenilirlik, hizmet kalitesi ve erişim kolaylığı. Ayrıca
 kullanıcılar, para çekme/yatırma gibi gündelik işlemlerinde en uygun ATM'yi seçmek isterler.
 
 ![Akbank Bitirime Proje sunumu](https://github.com/user-attachments/assets/09e6d9df-efd8-4447-a2ae-fe4114300ee8)
 # Proje Açıklaması
 ATM-RS, kullanıcılara en yakın mesafedeki ve çalışır durumda olan en uygun ATM'yi bulmalarını
 hedefler. Bu sistem, kullanıcıların anlık konumuna göre ATM’ye olan mesafesi, bakım durumu,
 döviz hizmeti sunup sunmadığı, çalışıp çalışmadığı, arıza geçmişi, nakit yüklenme sıklığı, trafik
 durumu ve kullanıcı puanları parametrelerini göz önünde bulundurur.
 Projede makine öğrenmesi modeli ile önerilecek ATM'ler tahmin edilmektedir. Kullanıcı
 deneyimini iyileştirmek için önerilen ve önerilmeyen ATM'ler harita üzerinde farklı renkte temsil
 edilmektedir. Böylece kullanıcılar, hangi ATM'lerin önerildiğini ve önerilmediğini görsel olarak
 hızlıca anlayabilirler. Aynı zamanda sistem, önerilen ATM'ler arasından en yakına en uygun
 rotayı çizerek kullanıcının ATM'ye daha rahat ulaşmasını sağlar.
 Bu proje, kullanıcıların ATM kullanım deneyimlerini iyileştirmek için yenilikçi bir çözüm sunar ve
 bankacılık hizmetlerinin erişilebilirliğini ve kalitesini artırmayı hedefler.
 
 ![2](https://github.com/user-attachments/assets/8ab76168-2095-421f-b4c6-70d8f52aa540)
## Veri Setinin Anlaşılması
 Modeli eğitmek için hedef değişken dışında 8 adet parametreden oluşan veri seti kullanılmıştır.
 Seçilen özellikler (features) aşağıdaki şekildedir:
 
 Uzaklık (km): Kullanıcının bulunduğu konum ile ATM arasındaki mesafeyi kilometre cinsinden
 belirtir. Kullanıcılar genellikle kendilerine yakın ATM'leri tercih eder, bu nedenle uzaklık önemli bir
 faktördür.
 
 Bakım (Ay): ATM'nin son bakımının üzerinden geçen süreyi ay cinsinden gösterir. Bakımı düzenli
 yapılan ATM'lerin daha az arıza yapma olasılığı yüksektir, bu da kullanıcı deneyimini olumlu
 etkiler.
 
 Döviz: ATM'nin döviz bozdurma hizmeti sunup sunmadığını belirtir. Evet/Hayır değeri alır. Döviz
 çekmek isteyen kullanıcılar için önemli bir kriterdir.
 
 Çalışıyor mu?: ATM'nin şu anda çalışır durumda olup olmadığı bilgisini içerir. Evet/Hayır değeri
 alır. Çalışmayan bir ATM elbette önerilemez.
 
 Arıza: Son bir ay içinde ATM'de kaç kez arıza raporu verildiğini gösterir. Arıza sayısı ne kadar
 fazlaysa, ATM'nin güvenilirliği o kadar düşük olur ve önerilme olasılığı azalır.
 
 Yükleme (Gün Önce): ATM'ye son nakit yüklemesinin üzerinden kaç gün geçtiğini belirtir. Yakın
 zamanda nakit yüklenmiş bir ATM'nin nakitsiz kalma olasılığı daha düşüktür, bu da tercih edilme
 sebebidir.
 
 Trafik: ATM'nin bulunduğu konumun yoğun saatlerde (mesai giriş/çıkış saatleri gibi) trafik
 yoğunluğu olup olmadığını belirtir. Evet/Hayır değeri alır. Yoğun trafik, ATM'ye ulaşımı
 zorlaştırabilir, bu yüzden bazı kullanıcılar için tercih edilmeyebilir.
 
 Kullanıcı Puanı: ATM'yi daha önce kullanan kişilerin verdiği ortalama puanı gösterir. 2.5 ile 5
 arasında bir değer alır. Yüksek puanlı ATM'ler genellikle daha iyi hizmet ve kullanıcı deneyimi
 sunar

 ## Algoritma Seçimi ve Makine Öğrenimi
 ### Makine Öğrenimi Modellerinin Seçimi
 
 Projede ATM öneri sistemini geliştirmek için çeşitli makine öğrenmesi modelleri
 değerlendirilmiştir. Problemimiz, bir ATM'nin kullanıcıya önerilip önerilmeyeceğini tahmin etmek
 olduğu için, bu bir sınıflandırma (classification) problemi olarak ele alınmıştır. Seçilen modeller,
 bu sınıflandırma görevini en iyi şekilde yerine getirebilmek amacıyla test edilmiştir. proje
 kapsamında LogisticRegression, RidgeClassifier, DecisionTreeClassifier, GaussianNB,
 MLPClassifier, RandomForestClassifier algoritmaları kullanılarak denemeler yapılmıştır.

 ## Model Seçimi ve Değerlendirme
 
 Yapılan denemeler sonucunda, farklı modellerin performansları çapraz doğrulama
 (cross-validation) gibi çeşitli doğrulama yöntemleri kullanılarak ölçülmüştür.
 Çapraz doğrulama ve diğer doğrulama yöntemleri sonucunda en düşük hata oranına sahip
 model Random Forest Classifier olarak belirlenmiştir. Bu model, yüksek doğruluk ve genelleme
 yeteneği sağladığı için önerilen ATM'leri tahmin etmede en başarılı sonuçları vermiştir. Bu model,
 ATM öneri sisteminde kullanıcıların en uygun ATM'leri bulmalarına yardımcı olacak şekilde
 kullanılmıştır.

 ## Sonuç ve Değerlendirme
 
 Bu proje, kullanıcıların en uygun ATM'yi bulmalarını sağlamak amacıyla geliştirilmiş bir ATM öneri
 sistemini kapsamaktadır. Yapılan modellemeler sonucunda, Random Forest Classifier en yüksek
 doğruluk oranını elde ederek en başarılı model olarak seçilmiştir. Bu model, kullanıcıların
 ihtiyaçlarına uygun ATM'leri etkili bir şekilde tahmin etmiştir.
 
 ATM-RS, ATM'lerin mesafe, bakım durumu, döviz hizmeti, çalışırlık, arıza geçmişi, nakit
 yüklenme sıklığı, trafik durumu ve kullanıcı puanı gibi kriterleri değerlendirerek önerilerde
 bulunmaktadır. Harita üzerinde ATM'lerin görsel olarak farklı renklerde gösterilmesi, kullanıcıların
 önerilen ve önerilmeyen ATM'leri hızlıca ayırt etmelerini sağlamaktadır. Ayrıca, sistem en yakın
 ATM' ye en uygun rotayı çizerek erişimi kolaylaştırmaktadır.
 
 Sonuç olarak ATM-RS’ nin , ATM bulma sürecini daha hızlı hale getireceği ve kullanıcı
 memnuniyetini artıracağı düşünülmektedir. Gelecekte, modelin gerçek veri ile test edilmesi ve ek
 özelliklerle geliştirilmesi, kullanıcı deneyimini daha da iyileştirebilir.

 Harita başlangıç durumu
 ![image](https://github.com/user-attachments/assets/f5c11349-bb91-4ca0-acc9-d95d8ae709be)

Model'in önerilen ATM'leri tahminlemesi ve en yakın önerilen ATM'ye rota oluşturması durumu
 ![image](https://github.com/user-attachments/assets/be82d987-1b0b-4bc1-a578-8bb7c7d83f1d)


