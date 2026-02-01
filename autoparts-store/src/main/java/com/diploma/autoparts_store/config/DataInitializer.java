package com.diploma.autoparts_store.config;

import com.diploma.autoparts_store.entity.Cart;
import com.diploma.autoparts_store.entity.Category;
import com.diploma.autoparts_store.entity.Product;
import com.diploma.autoparts_store.entity.Role;
import com.diploma.autoparts_store.entity.User;
import com.diploma.autoparts_store.repository.CartRepository;
import com.diploma.autoparts_store.repository.CategoryRepository;
import com.diploma.autoparts_store.repository.ProductRepository;
import com.diploma.autoparts_store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            initUsers();
        }
        if (productRepository.count() == 0) {
            System.out.println(">>> Products count is 0. Re-initializing Catalog...");
            productRepository.deleteAll();
            categoryRepository.deleteAll();
            initCategoriesAndProducts();
        }
    }

    private void initUsers() {
        User admin = User.builder()
                .firstName("Admin")
                .lastName("Superuser")
                .phone("+70000000000")
                .password(passwordEncoder.encode("admin"))
                .role(Role.ADMIN)
                .balance(new BigDecimal("0.00"))
                .build();

        userRepository.save(admin);
        cartRepository.save(Cart.builder().user(admin).build());

        User client = User.builder()
                .firstName("Иван")
                .lastName("Клиентов")
                .phone("+77770000000")
                .password(passwordEncoder.encode("password"))
                .role(Role.CLIENT)
                .balance(new BigDecimal("50000.00"))
                .build();

        userRepository.save(client);
        cartRepository.save(Cart.builder().user(client).build());

        System.out.println(">>> Users initialized: Admin (+70000000000 / admin), Client (+77770000000 / password)");
    }

    private void initCategoriesAndProducts() {
        Category maintenance = new Category();
        maintenance.setName("ТО и Запчасти");
        categoryRepository.save(maintenance);

        Category oils = new Category();
        oils.setName("Масла и жидкости");
        oils.setParent(maintenance);
        categoryRepository.save(oils);

        Category filters = new Category();
        filters.setName("Фильтры");
        filters.setParent(maintenance);
        categoryRepository.save(filters);

        Category brakes = new Category();
        brakes.setName("Тормозная система");
        categoryRepository.save(brakes);

        Category pads = new Category();
        pads.setName("Колодки");
        pads.setParent(brakes);
        categoryRepository.save(pads);

        Category discs = new Category();
        discs.setName("Диски");
        discs.setParent(brakes);
        categoryRepository.save(discs);

        Category electrics = new Category();
        electrics.setName("Электрика");
        categoryRepository.save(electrics);

        List<Product> products = List.of(
                Product.builder()
                        .name("Моторное масло Shell Helix Ultra 5W-40 4л")
                        .sku("OIL-SHELL-5W40-4")
                        .description("Полностью синтетическое моторное масло для современных двигателей.")
                        .price(new BigDecimal("18500.00"))
                        .stockQuantity(50)
                        .category(oils)
                        .imageUrl("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmaslenych.ru%2Fupload%2Fw247%2FimageCache%2F33e%2F4a7%2F246e9bec2d4808e6a3e5d1a167817d98.jpg&f=1&nofb=1&ipt=0212078d5370fec46a592d3f14455a1b4f399cab3cb6289db3feffac694da752")
                        .build(),

                Product.builder()
                        .name("Моторное масло Motul 8100 X-cess 5W-40 5л")
                        .sku("OIL-MOTUL-5W40-5")
                        .description("Высококачественное синтетическое масло.")
                        .price(new BigDecimal("24000.00"))
                        .stockQuantity(30)
                        .category(oils)
                        .imageUrl("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.DPKtHFwm5GtwKIyXChbRLwHaHa%3Fcb%3Ddefcachec2%26pid%3DApi&f=1&ipt=3b0cbfaa0fc9d96949ba6edf80c5a91ba29547f453df249022ff644723624365")
                        .build(),

                Product.builder()
                        .name("Масляный фильтр MANN-FILTER W 712/94")
                        .sku("FIL-MANN-W712")
                        .description("Оригинальный масляный фильтр для VAG группы.")
                        .price(new BigDecimal("4500.00"))
                        .stockQuantity(100)
                        .category(filters)
                        .imageUrl("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fir.ozone.ru%2Fs3%2Fmultimedia-2%2Fc1000%2F6751324046.jpg&f=1&nofb=1&ipt=d46c054bce5f6593795f50a1cec1762d85494447ac2218b9be8d64eff38e9698")
                        .build(),

                Product.builder()
                        .name("Воздушный фильтр Bosch F 026 400 002")
                        .sku("FIL-BOSCH-AIR")
                        .description("Надежная защита двигателя от пыли.")
                        .price(new BigDecimal("3200.00"))
                        .stockQuantity(80)
                        .category(filters)
                        .imageUrl("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages2.exist.ua%2Fmedia%2Fimages%2Fproducts%2F2020%2F10%2F45__QPoRdEa.jpg&f=1&nofb=1&ipt=ba927daa6633c058a45e7fc5cf064deadda827347c2a10efb9b304670e14af5f")
                        .build(),

                Product.builder()
                        .name("Тормозные колодки Brembo передние")
                        .sku("BRK-BREMBO-FR")
                        .description("Премиальные тормозные колодки. Высокая эффективность торможения.")
                        .price(new BigDecimal("12000.00"))
                        .stockQuantity(20)
                        .category(pads)
                        .imageUrl("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.access-honda.com%2Fsitefiles%2Frawm%2F1000%2FItems%2F60673380839j0ukc.jpg&f=1&nofb=1&ipt=d3b64abc1e45f721f0277329b55beba29934604c54619f9d6272fdb994b2df51")
                        .build(),

                Product.builder()
                        .name("Тормозные диски TRW задние (комплект)")
                        .sku("BRK-TRW-RR")
                        .description("Вентилируемые тормозные диски.")
                        .price(new BigDecimal("28000.00"))
                        .stockQuantity(10)
                        .category(discs)
                        .imageUrl("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.ozone.ru%2Fs3%2Fmultimedia-4%2Fc600%2F6427525492.jpg&f=1&nofb=1&ipt=56e36f60345dba22a24473015d0f83d5e6215c9a34097230e8c906cfc8a263fd")
                        .build(),

                Product.builder()
                        .name("Аккумулятор VARTA Blue Dynamic D24 60 Ач")
                        .sku("BAT-VARTA-60")
                        .description("Надежный аккумулятор для любых погодных условий.")
                        .price(new BigDecimal("45000.00"))
                        .stockQuantity(5)
                        .category(electrics)
                        .imageUrl("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.onlinetrade.ru%2Fimg%2Fitems%2Fm%2Fvarta_d24_blue_dynamic_560_408_054_obratnaya_polyarnost_60_ach_128667_4.jpg&f=1&nofb=1&ipt=952d23528f03fb6155ece9ff5263f5fd109a576b4a3a80d4c5044bac05da1ef3")
                        .build()
        );

        productRepository.saveAll(products);
        System.out.println(">>> Categories and Products initialized!");
    }
}
