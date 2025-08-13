package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(21)
@Installer(name = "update lab result",
        description = "update lab result table by setting both date_created and date_modified to the value of date_result_received",
        version = 1)
public class LabResultUpdateInstaller extends AcrossLiquibaseInstaller {
    public  LabResultUpdateInstaller() {
        super("classpath:installers/hiv/schema/update-lab-result.xml");
    }
}