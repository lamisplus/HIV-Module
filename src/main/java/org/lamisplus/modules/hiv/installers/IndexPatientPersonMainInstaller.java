package org.lamisplus.modules.hiv.installers;


import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(2)
@Installer(name = "index-patient-person-main-installer",
        description = "Install patient person main index",
        version = 4)
public class IndexPatientPersonMainInstaller extends AcrossLiquibaseInstaller {
    public IndexPatientPersonMainInstaller() {
        super("classpath:installers/hiv/schema/create_indexes.xml");
    }
}