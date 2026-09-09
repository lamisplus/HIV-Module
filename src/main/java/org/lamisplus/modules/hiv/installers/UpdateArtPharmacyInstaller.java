package org.lamisplus.modules.hiv.installers;



import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(29)
@Installer(name = "update-art-pharmacy",
        description = "Add dispensed_by_user_uuid column to hiv_art_pharmacy table",
        version = 1)
public class UpdateArtPharmacyInstaller extends AcrossLiquibaseInstaller {

    public UpdateArtPharmacyInstaller() {
        super("classpath:installers/hiv/schema/update_art_pharmacy.xml");
    }
}
