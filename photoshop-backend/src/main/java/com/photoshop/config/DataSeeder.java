package com.photoshop.config;

import com.photoshop.entity.*;
import com.photoshop.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final EquipmentRepository equipmentRepository;
    private final GalleryRepository galleryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedServices();
        seedEquipment();
        seedGallery();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@photoshop.com")) {
            User admin = User.builder()
                .fullName("Admin User")
                .email("admin@photoshop.com")
                .password(passwordEncoder.encode("Admin@123"))
                .roles(Set.of(User.Role.ROLE_ADMIN, User.Role.ROLE_USER))
                .enabled(true)
                .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@photoshop.com / Admin@123");
        }

        if (!userRepository.existsByEmail("user@photoshop.com")) {
            User user = User.builder()
                .fullName("Demo User")
                .email("user@photoshop.com")
                .password(passwordEncoder.encode("User@123"))
                .phone("+94771234567")
                .roles(Set.of(User.Role.ROLE_USER))
                .enabled(true)
                .build();
            userRepository.save(user);
            log.info("Demo user created: user@photoshop.com / User@123");
        }
    }

    private void seedServices() {
        if (serviceRepository.count() == 0) {
            serviceRepository.save(Service.builder()
                .name("Portrait Photography Session")
                .description("Professional portrait session in our state-of-the-art studio. Perfect for individuals, couples, or small groups. Includes lighting setup, 2-hour session, and digital editing of 20 best shots.")
                .price(new BigDecimal("15000.00"))
                .durationMinutes(120)
                .serviceType(Service.ServiceType.PORTRAIT)
                .thumbnailImage("https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600")
                .includes("Studio lighting, professional editing, 20 digital photos, 1 print")
                .maxParticipants(5)
                .active(true)
                .build());

            serviceRepository.save(Service.builder()
                .name("Wedding Photography Package")
                .description("Full-day wedding photography coverage from preparation to reception. Two photographers, candid and posed shots, drone aerial shots, and a luxury photo album.")
                .price(new BigDecimal("85000.00"))
                .durationMinutes(480)
                .serviceType(Service.ServiceType.WEDDING)
                .thumbnailImage("https://images.unsplash.com/photo-1519741497674-611481863552?w=600")
                .includes("2 photographers, drone shots, 500+ edited photos, luxury album, same-day highlights")
                .maxParticipants(2)
                .active(true)
                .build());

            serviceRepository.save(Service.builder()
                .name("Corporate Headshots")
                .description("Professional headshots for your team. Quick, efficient sessions perfect for LinkedIn profiles, company websites, and press materials.")
                .price(new BigDecimal("8000.00"))
                .durationMinutes(60)
                .serviceType(Service.ServiceType.CORPORATE)
                .thumbnailImage("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600")
                .includes("Studio setup, 5 edited photos per person, digital delivery")
                .maxParticipants(10)
                .active(true)
                .build());

            serviceRepository.save(Service.builder()
                .name("Product Photography")
                .description("High-quality product photography for e-commerce, catalogs, and marketing. White background, lifestyle, and creative product shoots available.")
                .price(new BigDecimal("12000.00"))
                .durationMinutes(180)
                .serviceType(Service.ServiceType.PRODUCT)
                .thumbnailImage("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600")
                .includes("Studio setup, up to 10 products, white/colored backgrounds, 30 edited photos")
                .active(true)
                .build());

            serviceRepository.save(Service.builder()
                .name("Family Photography Session")
                .description("Capture precious family moments in our family-friendly studio or outdoor locations. Relaxed atmosphere, fun props, and natural poses.")
                .price(new BigDecimal("18000.00"))
                .durationMinutes(150)
                .serviceType(Service.ServiceType.FAMILY)
                .thumbnailImage("https://images.unsplash.com/photo-1511895426328-dc8714191011?w=600")
                .includes("Indoor/outdoor options, props, 30 edited photos, family album")
                .maxParticipants(8)
                .active(true)
                .build());

            serviceRepository.save(Service.builder()
                .name("Event Photography")
                .description("Professional event coverage for corporate events, parties, conferences, and special occasions. Unobtrusive, candid photography throughout your event.")
                .price(new BigDecimal("25000.00"))
                .durationMinutes(240)
                .serviceType(Service.ServiceType.EVENT)
                .thumbnailImage("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600")
                .includes("Full event coverage, 200+ edited photos, online gallery, commercial rights")
                .active(true)
                .build());

            log.info("Services seeded successfully");
        }
    }

    private void seedEquipment() {
        if (equipmentRepository.count() == 0) {
            equipmentRepository.save(Equipment.builder()
                .name("Sony A7R V Mirrorless Camera")
                .brand("Sony")
                .description("61MP full-frame mirrorless camera with advanced AI-based autofocus. Perfect for portrait, landscape, and studio photography. Includes battery, charger, and body cap.")
                .dailyRentalPrice(new BigDecimal("3500.00"))
                .weeklyRentalPrice(new BigDecimal("18000.00"))
                .totalStock(3)
                .availableStock(3)
                .category(Equipment.EquipmentCategory.CAMERA)
                .thumbnailImage("https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600")
                .specifications("61MP, ISO 80-32000, 4K video, 5-axis IBIS, dual card slots")
                .active(true)
                .build());

            equipmentRepository.save(Equipment.builder()
                .name("Canon EOS R5 Mirrorless Camera")
                .brand("Canon")
                .description("45MP full-frame camera with 8K video recording capability. Excellent for both photography and videography projects.")
                .dailyRentalPrice(new BigDecimal("3000.00"))
                .weeklyRentalPrice(new BigDecimal("15000.00"))
                .totalStock(2)
                .availableStock(2)
                .category(Equipment.EquipmentCategory.CAMERA)
                .thumbnailImage("https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600")
                .specifications("45MP, 8K RAW video, Dual Pixel CMOS AF II, 12fps burst")
                .active(true)
                .build());

            equipmentRepository.save(Equipment.builder()
                .name("Sony FE 24-70mm f/2.8 GM II Lens")
                .brand("Sony")
                .description("Professional standard zoom lens. Exceptional sharpness and bokeh. Ideal for portraits, events, and general photography.")
                .dailyRentalPrice(new BigDecimal("1800.00"))
                .weeklyRentalPrice(new BigDecimal("9000.00"))
                .totalStock(4)
                .availableStock(4)
                .category(Equipment.EquipmentCategory.LENS)
                .thumbnailImage("https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600")
                .specifications("24-70mm, f/2.8 constant aperture, XD Linear Motor, weather-sealed")
                .active(true)
                .build());

            equipmentRepository.save(Equipment.builder()
                .name("Profoto B10X Plus Studio Flash")
                .brand("Profoto")
                .description("250Ws portable studio flash with built-in Bluetooth. Perfect for studio and on-location shoots. TTL compatible with all major camera brands.")
                .dailyRentalPrice(new BigDecimal("2500.00"))
                .weeklyRentalPrice(new BigDecimal("12000.00"))
                .totalStock(6)
                .availableStock(6)
                .category(Equipment.EquipmentCategory.LIGHTING)
                .thumbnailImage("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600")
                .specifications("250Ws, 20-stop range, TTL/HSS, Bluetooth control, rechargeable battery")
                .active(true)
                .build());

            equipmentRepository.save(Equipment.builder()
                .name("DJI Mavic 3 Pro Drone")
                .brand("DJI")
                .description("Professional aerial drone with Hasselblad camera. Perfect for weddings, real estate, and event aerial photography.")
                .dailyRentalPrice(new BigDecimal("5000.00"))
                .weeklyRentalPrice(new BigDecimal("25000.00"))
                .totalStock(2)
                .availableStock(2)
                .category(Equipment.EquipmentCategory.DRONE)
                .thumbnailImage("https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600")
                .specifications("4/3 CMOS Hasselblad, 5.1K video, 43min flight time, omnidirectional obstacle sensing")
                .active(true)
                .build());

            equipmentRepository.save(Equipment.builder()
                .name("Manfrotto 055XPRO3 Carbon Tripod")
                .brand("Manfrotto")
                .description("Professional carbon fiber tripod with 3-way pan/tilt head. Stable and lightweight. Essential for landscape, architecture, and product photography.")
                .dailyRentalPrice(new BigDecimal("800.00"))
                .weeklyRentalPrice(new BigDecimal("4000.00"))
                .totalStock(8)
                .availableStock(8)
                .category(Equipment.EquipmentCategory.TRIPOD)
                .thumbnailImage("https://images.unsplash.com/photo-1617895153857-82fe0c43621c?w=600")
                .specifications("Carbon fiber, max height 167cm, load 8kg, 3-way head, quick release")
                .active(true)
                .build());

            equipmentRepository.save(Equipment.builder()
                .name("Complete Studio Backdrop Kit")
                .brand("Westcott")
                .description("Professional backdrop stand system with 5 muslin backdrops (white, black, gray, blue, green). Perfect for portrait and product photography.")
                .dailyRentalPrice(new BigDecimal("1200.00"))
                .weeklyRentalPrice(new BigDecimal("6000.00"))
                .totalStock(3)
                .availableStock(3)
                .category(Equipment.EquipmentCategory.BACKDROP)
                .thumbnailImage("https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600")
                .specifications("3m x 6m stands, 5 muslin backdrops, carry bag, spring clamps included")
                .active(true)
                .build());

            equipmentRepository.save(Equipment.builder()
                .name("Rode VideoMic Pro+ Microphone")
                .brand("Rode")
                .description("Professional directional on-camera microphone. Essential for video shoots, interviews, and event videography.")
                .dailyRentalPrice(new BigDecimal("600.00"))
                .weeklyRentalPrice(new BigDecimal("3000.00"))
                .totalStock(5)
                .availableStock(5)
                .category(Equipment.EquipmentCategory.ACCESSORIES)
                .thumbnailImage("https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=600")
                .specifications("Supercardioid, -32dB to +20dB gain, lithium-ion battery, auto power function")
                .active(true)
                .build());

            log.info("Equipment seeded successfully");
        }
    }

    private void seedGallery() {
        if (galleryRepository.count() == 0) {
            String[] titles = {"Golden Hour Portrait", "Wedding Bliss", "Corporate Excellence",
                "Product Showcase", "Family Moments", "Urban Fashion", "Nature's Palette", "Event Energy"};
            Gallery.GalleryCategory[] categories = {
                Gallery.GalleryCategory.PORTRAIT, Gallery.GalleryCategory.WEDDING,
                Gallery.GalleryCategory.CORPORATE, Gallery.GalleryCategory.PRODUCT,
                Gallery.GalleryCategory.FAMILY, Gallery.GalleryCategory.FASHION,
                Gallery.GalleryCategory.PORTRAIT, Gallery.GalleryCategory.EVENT
            };
            String[] images = {
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
                "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
                "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
                "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800",
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800",
                "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800",
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
            };

            for (int i = 0; i < titles.length; i++) {
                galleryRepository.save(Gallery.builder()
                    .title(titles[i])
                    .imageUrl(images[i])
                    .category(categories[i])
                    .featured(i < 4)
                    .sortOrder(i)
                    .active(true)
                    .build());
            }
            log.info("Gallery seeded successfully");
        }
    }
}
