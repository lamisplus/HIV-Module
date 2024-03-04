package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(1)
@Installer(name = "new-table-installer",
		description = "Installs new tables",
		version = 4)
public class NewTableInstaller extends AcrossLiquibaseInstaller {
	public NewTableInstaller() {
		super("classpath:installers/hiv/schema/new-create-table.xml");
	}
}
