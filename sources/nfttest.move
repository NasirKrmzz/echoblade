  /// Module: nfttest
  module proje::nfttest;

  // === Imports ===
  // Gerekli kütüphaneleri içe aktarıyoruz
  use std::string::String; // String veri tipi için
  use sui::{display, package, balance::{Self, Balance}, sui::SUI, coin::{Coin}, event}; // Sui platformundan çeşitli modüller
  //suiuse echoblade::cap::{AdminCap}; // Admin yetkilerini yönetmek için başka bir modülden AdminCap yapısını kullanıyoruz

  // === Errors ===
  // Hata kodları tanımlıyoruz
  const ENotEnoughBalance: u64 = 0; // Yetersiz bakiye hatası için sabit bir hata kodu

  // === Constants ===
  // Sabit değerler tanımlıyoruz
  const NFT_MINT_COST: u64 = 50_000; // NFT basma maliyeti (100 milyon MIST, Sui'nin yerel para birimi)

  // === Structs ===
  // Veri yapıları tanımlıyoruz

  // NFT yapısı: Bir NFT'nin özelliklerini temsil eder
  public struct NFT has key, store {
    id: UID, // Benzersiz kimlik (Sui'de her nesnenin bir UID'si olur)
    name: String, // NFT'nin adı
    description: String, // NFT'nin açıklaması
    url: String, // NFT'nin görseline veya metadata'sına işaret eden URL
  }

  // Treasury yapısı: NFT basımı için toplanan parayı (SUI) saklar
  public struct Treasury<phantom T> has key, store {
    id: UID, // Benzersiz kimlik
    balance: Balance<T>, // Hazineye yatırılan SUI bakiyesi
    nft_mint_cost: u64, // NFT basma maliyeti
  }

  // === Witnesses ===
  // Modülün kimliğini doğrulamak için kullanılan bir tanık (witness) yapısı
  public struct NFTTEST has drop {}

  // === Events ===
  // Olay yapıları: NFT basıldığında zincire kaydedilecek olay
  public struct MintNFTEvent has copy, drop {
    id: ID, // Basılan NFT'nin kimliği
    name: String, // NFT'nin adı
    description: String, // NFT'nin açıklaması
    url: String, // NFT'nin URL'si
  }

  // === Method Aliases ===
  // (Bu bölümde takma ad tanımlanmamış, boş bırakılmış)

  // === Initialization ===
  // Modül başlatıldığında çalışacak fonksiyon
  fun init(otw: NFTTEST, ctx: &mut TxContext) {
    // Yayıncı (publisher) nesnesi oluşturuluyor, bu modülün sahipliğini temsil eder
    let publisher = package::claim(otw, ctx);

    // NFT'nin nasıl görüneceğini tanımlamak için bir display nesnesi oluşturuyoruz
    let mut display = display::new<NFT>(&publisher, ctx);

    // NFT'nin metadata'sında hangi alanların nasıl görüneceğini belirliyoruz
    display.add(b"name".to_string(), b"#{name}".to_string()); // İsim alanı: #{name} formatında
    display.add(b"description".to_string(), b"{description}".to_string()); // Açıklama alanı
    display.add(b"image_url".to_string(), b"{url}".to_string()); // Görsel URL'si

    // Display nesnesinin versiyonunu güncelliyoruz
    display.update_version();

    // Hazine (Treasury) nesnesi oluşturuyoruz, SUI token'larını saklayacak
    let treasury = Treasury<SUI> {
      id: object::new(ctx), // Benzersiz kimlik
      balance: balance::zero(), // Başlangıçta sıfır bakiye
      nft_mint_cost: NFT_MINT_COST, // NFT basma maliyeti
    };

    // Transfer işlemleri:
    transfer::public_transfer(display, ctx.sender()); // Display nesnesini modülü çağıran adrese gönder
    transfer::public_transfer(publisher, ctx.sender()); // Yayıncı nesnesini modülü çağıran adrese gönder
    transfer::share_object(treasury); // Hazineyi paylaşılan bir nesne yap (herkes erişebilir)
  }

  // === Public Functions ===
  // Herkesin çağırabileceği fonksiyonlar

  // NFT basma fonksiyonu
  #[allow(lint(self_transfer))] // Kendi kendine transfer uyarısını görmezden gel
  public fun mint_nft(
    treasury: &mut Treasury<SUI>, // Hazine nesnesi
    mut coin: Coin<SUI>, // Kullanıcının ödeyeceği SUI coin'i
    name: String, // NFT'nin adı
    description: String, // NFT'nin açıklaması
    url: String, // NFT'nin URL'si
    ctx: &mut TxContext // İşlem bağlamı
  ): NFT {
    // Kullanıcının ödediği miktarın, NFT basma maliyetinden büyük veya eşit olduğunu kontrol et
    assert!(coin.value() >= treasury.nft_mint_cost, ENotEnoughBalance);

    // Ödenen miktardan NFT basma maliyetini hazineye ekle
    treasury.balance.join(coin.split(treasury.nft_mint_cost, ctx).into_balance());

    // Eğer ödenen coin'de kalan miktar sıfırsa, coin'i yok et
    if (coin.value() == 0) {
      coin.destroy_zero();
    } else {
      // Kalan miktarı kullanıcıya geri transfer et
      transfer::public_transfer(coin, ctx.sender());
    };

    // Yeni bir NFT oluştur
    let nft = NFT {
      id: object::new(ctx), // Benzersiz kimlik
      name: name,
      description: description,
      url: url,
    };

    // NFT basıldığını bildiren bir olay (event) yayınla
    event::emit(MintNFTEvent {
      id: object::id(&nft),
      name: name,
      description: description,
      url: url,
    });

    // Oluşturulan NFT'yi döndür
    nft
  }

  // === View Functions ===
  // (Bu bölümde görüntüleme fonksiyonları tanımlanmamış)

  // === Admin Functions ===
  // Yalnızca AdminCap sahibi olanların çağırabileceği yönetim fonksiyonları

  // NFT basma maliyetini güncelleme fonksiyonu


  // === Package Functions ===
  // (Bu bölümde paket fonksiyonları tanımlanmamış)

  // === Private Functions ===
  // (Bu bölümde özel fonksiyonlar tanımlanmamış)

  // === Test Functions ===
  // (Bu bölümde test fonksiyonları tanımlanmamış)

