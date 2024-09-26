package org.lamisplus.modules.hiv.installers;


import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(12)
@Installer(name = "lab-test-table-schema-installer", description = "update lab test table", version = 1)
public class LabTestUpdateInstaller extends AcrossLiquibaseInstaller {
    public  LabTestUpdateInstaller() {
        super("classpath:installers/hiv/schema/lab-test-update.xml");
    }
}
