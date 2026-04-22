package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(26)
@Installer(name = "care-card-followup-columns-installer",
        description = "Add Care Card Follow-Up columns to hiv_art_clinical table including cd4_data JSONB field",
        version = 5)
public class CareCardFollowUpColumnsInstaller extends AcrossLiquibaseInstaller {
    public CareCardFollowUpColumnsInstaller() {
        super("classpath:installers/hiv/schema/add-care-card-followup-columns.xml");
    }
}
