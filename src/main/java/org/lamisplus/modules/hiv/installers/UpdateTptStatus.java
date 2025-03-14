package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(18)
@Installer(name = "update-tpt-status",
        description = "update client tpt status ",
        version = 1)
public class  UpdateTptStatus extends AcrossLiquibaseInstaller {
    public  UpdateTptStatus() {
        super("classpath:installers/hiv/schema/update_tpt_status.xml");
    }
}
